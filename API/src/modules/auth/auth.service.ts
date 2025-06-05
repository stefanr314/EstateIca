import { User } from "../user/user.model";
import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  PRODUCTION,
} from "../../config/config";
import bcrypt from "bcrypt";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../../shared/errors";
import { RegisterGuestDto } from "./dtos/registerGuest.dto";
import { LoginUserDto } from "./dtos/loginUser.dto";
import { EmailTemplates } from "../../shared/types/emailTemplates.enum";
import { sendEmail } from "../../shared/utils/sendMail";
import { ForgotPasswordDto } from "./dtos/forgotPassword.dto";
import crypto from "crypto";
import { ResetPasswordDto } from "./dtos/resetPassword.dto";
import { VerifyAccountDto } from "./dtos/verifyAccount.dto";
import { createToken } from "../../shared/utils/createTokenLogic";
import { OnVerifyAccountDto } from "./dtos/onVerifyAccount.dto";

// Interfejs za payload
type JwtPayload = {
  id: string;
  role: string;
};

export class AuthService {
  async register(dto: RegisterGuestDto): Promise<void> {
    const existingUser = await User.findOne({ email: dto.email });
    if (existingUser) {
      throw new ConflictError("User already exists");
    }

    const newUser = new User(dto); //handle password hashing in the User model

    await newUser.save();
  }

  async login(
    dto: LoginUserDto
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = dto;
    const user = await User.findOne({ email });
    if (!user) throw new UnauthorizedError("Invalid credentials");

    if (!user.isActive) throw new ForbiddenError("User is not active");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedError("Invalid credentials");

    const payload = {
      id: user._id.toString(),
      role: user.role,
      isActive: user.isActive,
      isVerified: user.isVerified,
    };
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET!, {
      expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRATION!),
    });

    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET!, {
      expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRATION!),
    });

    user.refreshToken = refreshToken;
    await user.save();

    return { accessToken, refreshToken };
  }

  async logout(refreshToken: string): Promise<void> {
    const user = await User.findOne({ refreshToken });
    if (!user) return;

    user.refreshToken = "";
    await user.save();
  }

  async refresh(refreshToken: string) {
    const decoded = jwt.verify(
      refreshToken,
      REFRESH_TOKEN_SECRET!
    ) as JwtPayload;

    const user = await User.findOne({ refreshToken });

    if (!user)
      throw new ForbiddenError("Refresh token is invalid or user not found");
    if (!user.isActive) {
      throw new ForbiddenError("User is not active");
    }
    if (user._id.toString() !== decoded.id) {
      throw new ForbiddenError("Token mismatch");
    }

    const accessToken = jwt.sign(
      { id: decoded.id, role: user.role },
      ACCESS_TOKEN_SECRET!,
      { expiresIn: "1h" }
    );

    return accessToken;
  }

  async verifyAccount(dto: VerifyAccountDto) {
    const { email } = dto;
    const user = await User.findOne({ email });

    if (!user) throw new NotFoundError("User not found");
    if (!user.isActive) {
      throw new ForbiddenError("User is inactive");
    }
    if (user.isVerified) {
      throw new ConflictError("User is already verified");
    }
    // Helper function to create a token
    const {
      rawToken,
      hashedToken: verificationToken,
      expirationDate: verificationExpires,
    } = createToken();

    user.verificationToken = verificationToken;
    user.verificationExpires = verificationExpires;
    await user.save();

    const verificationLink = `https://example.com/verify?token=${rawToken}`;
    const info = await sendEmail({
      to: user.email,
      subject: "Verify your account",
      templateName: EmailTemplates.Verification,
      placeholders: {
        username: "User",
        verificationLink: verificationLink,
      },
    });
    logging.info(info);
  }

  async onVerifyAccount(dto: OnVerifyAccountDto) {
    const { token } = dto;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationExpires: { $gt: new Date() },
    });
    if (!user) throw new UnauthorizedError("Invalid token");
    if (user.isVerified) {
      throw new ConflictError("User is already verified.");
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await User.findOne({ email: dto.email });
    if (!user) throw new NotFoundError("User not found");

    if (!user.isActive) {
      throw new ForbiddenError("User is not active");
    }
    // Helper function to create a token
    const {
      rawToken,
      hashedToken: resetPasswordToken,
      expirationDate: resetPasswordExpires,
    } = createToken();

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = resetPasswordExpires;
    await user.save();

    const resetLink = `https://example.com/reset-password?token=${rawToken}&email=${encodeURIComponent(
      dto.email
    )}`;

    const info = await sendEmail({
      to: user.email,
      subject: "Forgot your password",
      templateName: EmailTemplates.ForgotPassword,
      placeholders: {
        username: user.firstName,
        resetLink,
      },
    });
  }

  async resetPassword(dto: ResetPasswordDto) {
    const hashedToken = crypto
      .createHash("sha256")
      .update(dto.resetToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });
    if (!user)
      throw new ForbiddenError("Password reset token is invalid or expired");
    if (!user.isActive) {
      throw new ForbiddenError("User is not active");
    }

    // Proceed with password reset
    user.password = dto.password; // handle password hashing in the User model
    user.resetPasswordToken = undefined; // Clear the reset token
    user.resetPasswordExpires = undefined; // Clear the expiration date
    await user.save();
    const info = await sendEmail({
      to: user.email,
      subject: "Your password has been reset",
      templateName: EmailTemplates.ResetPassword,
      placeholders: {
        username: user.firstName,
      },
    });
  }
}
