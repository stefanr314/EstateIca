import { Request, Response, NextFunction } from "express";
import { ForbiddenError, UnauthorizedError } from "../errors";
export function isActiveUser(req: Request, res: Response, next: NextFunction) {
  const user = req.user;
  if (!user) {
    throw new UnauthorizedError("User not authenticated");
  }
  if (!user.isActive) {
    throw new ForbiddenError("User is not active");
  }
  next();
}
