import { Request, Response, NextFunction } from "express";
import { ForbiddenError, UnauthorizedError } from "../errors";
export function isVerifiedUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = req.user;
  if (!user) {
    throw new UnauthorizedError("User not authenticated");
  }
  if (!user.isVerified) {
    throw new ForbiddenError("User is not verified");
  }
  next();
}
