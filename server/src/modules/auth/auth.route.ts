import { Router } from "express";
import {
  handleLogin,
  handleNewGuest,
  handleLogout,
  refreshToken,
  verifyAccount,
  forgotPassword,
  resetPassword,
  onVerifyAccount,
} from "./auth.controller";
import { isAuth } from "../../shared/middlewares/auth.middleware";
import { validate } from "../../shared/middlewares/validator";
import { registerGuestDto } from "./dtos/registerGuest.dto";
import { loginUserDto } from "./dtos/loginUser.dto";
import { forgotPasswordDto } from "./dtos/forgotPassword.dto";
import { resetPasswordDto } from "./dtos/resetPassword.dto";
import { onVerifyAccountDto } from "./dtos/onVerifyAccount.dto";

const router = Router();

router.post("/register", validate(registerGuestDto, "body"), handleNewGuest);
router.post("/login", validate(loginUserDto, "body"), handleLogin);
router.post("/logout", isAuth, handleLogout);
router.get("/refresh", refreshToken);
router.post("/verifyAcc", isAuth, verifyAccount);
router.patch(
  "/onVerifyAcc",
  validate(onVerifyAccountDto, "body"),
  onVerifyAccount
);
router.post(
  "/forgotPassword",
  validate(forgotPasswordDto, "body"),
  isAuth,
  forgotPassword
);
router.post(
  "/resetPassword",
  validate(resetPasswordDto, "body"),
  resetPassword
);

export default router;
