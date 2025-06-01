import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ForbiddenError, UnauthorizedError } from "../../shared/errors";
import { PRODUCTION } from "../../config/config";
import { LoginUserDto } from "./dtos/loginUser.dto";
import { RegisterGuestDto } from "./dtos/registerGuest.dto";
import { AuthService } from "./auth.service";
import { ForgotPasswordDto } from "./dtos/forgotPassword.dto";
import { ResetPasswordDto } from "./dtos/resetPassword.dto";
import { VerifyAccountDto } from "./dtos/verifyAccount.dto";
import { OnVerifyAccountDto } from "./dtos/onVerifyAccount.dto";

const authService = new AuthService();
// Interfejs za payload
interface JwtPayload {
  id: string;
  role: string;
}

export const handleNewGuest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const dto = req.body as RegisterGuestDto;

    const result = await authService.register(dto);
    logging.info("User registered", result);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
};

export const handleLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const dto = req.body as LoginUserDto;

    const { refreshToken, accessToken } = await authService.login(dto);

    // Set the refresh token in a cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: PRODUCTION,
      sameSite: "strict",
      maxAge: Number(process.env.REFRESH_TOKEN_EXPIRATION!),
    });

    res.json({ accessToken });
  } catch (error) {
    logging.error(error);
    // next(new ForbiddenError("Session expired"));
    next(error);
  }
};

export const handleLogout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken: string = req.cookies.refreshToken;

    if (!refreshToken) {
      res.sendStatus(204); // No Content – ništa za logout
      return;
    }

    await authService.logout(refreshToken);

    // Obriši kolačić sa klijenta
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: PRODUCTION,
      sameSite: "strict",
    });

    res.sendStatus(204); // Logout uspešan
    // res.json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token: string = req.cookies.refreshToken;

    if (!token) {
      throw new UnauthorizedError("Refresh token not provided");
    }

    const accessToken = await authService.refresh(token);

    res.json({ accessToken });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      logging.warn("Refresh token expired");
      return next(
        new UnauthorizedError("Session expired, please log in again.")
      );
    }
    logging.error(error);
    next(error);
  }
};

export const verifyAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const dto = req.body as VerifyAccountDto;
  try {
    await authService.verifyAccount(dto);
    res.status(200).json({ message: "Account verified successfully" });
  } catch (error) {
    next(error);
  }
};

export const onVerifyAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const dto = req.body as OnVerifyAccountDto;
  try {
    const result = await authService.onVerifyAccount(dto);
    res.status(200).json({ message: "Account verification completed", result });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const dto = req.body as ForgotPasswordDto;
  try {
    await authService.forgotPassword(dto);
    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const dto = req.body as ResetPasswordDto;
  try {
    await authService.resetPassword(dto);
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    next(error);
  }
};
