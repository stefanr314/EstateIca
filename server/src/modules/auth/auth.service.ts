import { User, UserDocument } from "../user/user.model";
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
import { ImageKitService } from "../../imagekit/imagekit.service";
import { Role } from "../../shared/types/role.enum";

// Interfejs za payload
type JwtPayload = {
  id: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
};

export class AuthService {
  async register(
    dto: RegisterGuestDto,
    profilePicture?: Express.Multer.File
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: UserDocument;
  }> {
    const existingUser = await User.findOne({ email: dto.email });
    if (existingUser) {
      throw new ConflictError("User already exists");
    }

    let profilePictureUrl: string = "";
    if (profilePicture) {
      const res: any = await ImageKitService.uploadFile(
        profilePicture.buffer,
        `${dto.email}-profile-${Date.now()}-${profilePicture.originalname}`,
        "profiles"
      );

      profilePictureUrl = res.url;
    }

    const newUser = new User({
      ...dto,
      profilePictureUrl,
      isActive: true,
      isVerified: false,
      role: Role.GUEST,
    }); //lozinka se hešuje na nivou modela

    await newUser.save();

    // JWT payload
    const payload = {
      id: newUser._id.toString(),
      role: newUser.role,
      isActive: newUser.isActive,
      isVerified: newUser.isVerified,
    };

    // Generiši access i refresh token
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET!, {
      expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRATION!),
    });

    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET!, {
      expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRATION!),
    });

    // Sačuvaj refresh token kod usera
    newUser.refreshToken = refreshToken;
    await newUser.save();

    return { accessToken, refreshToken, user: newUser };
  }

  async login(dto: LoginUserDto): Promise<{
    accessToken: string;
    refreshToken: string;
    user: UserDocument;
  }> {
    const { email, password } = dto;
    const user = await User.findOne({ email });
    if (!user)
      throw new UnauthorizedError("Email ili lozinka nisu ispravno uneseni.");

    if (!user.isActive) throw new ForbiddenError("Korisnik nije aktivan.");

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      throw new UnauthorizedError("Email ili lozinka nisu ispravno uneseni.");

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

    return { accessToken, refreshToken, user };
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

    const payload = {
      id: user._id.toString(),
      role: user.role,
      isActive: user.isActive,
      isVerified: user.isVerified,
    };
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET!, {
      expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRATION!),
    });

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

    const verificationLink = `http://localhost:5173/verify-account?token=${rawToken}`;
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

  async onVerifyAccount(
    dto: OnVerifyAccountDto
  ): Promise<{ user: UserDocument }> {
    const { token } = dto;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationExpires: { $gt: new Date() },
    });
    if (!user)
      throw new UnauthorizedError("Token nije validan ili je istekao.");
    if (user.isVerified) {
      throw new ConflictError("Korisnik je vec verifikovan.");
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();

    return { user };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await User.findOne({ email: dto.email });
    if (!user) throw new NotFoundError("Korisnik nije pronadjen.");

    if (!user.isActive) {
      throw new ForbiddenError("Korisnik nije aktivan.");
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

    const resetLink = `http://localhost:5173/reset-password?token=${rawToken}&email=${encodeURIComponent(
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
      throw new ForbiddenError(
        "Password reset token nije validan ili je istekao"
      );
    if (!user.isActive) {
      throw new ForbiddenError("Korisnik nije aktivan");
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
