import { Request, Response, NextFunction } from "express";
import { User } from "../../modules/user/user.model";
import { ForbiddenError, UnauthorizedError } from "../errors";

export const attachActiveUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user?.id)
    return next(new UnauthorizedError("User ID not found in request"));
  const user = await User.findById(req.user.id);
  if (!user) return next(new UnauthorizedError("User not found"));

  if (!user.isActive) return next(new ForbiddenError("Account is deactivated"));

  next();
};
