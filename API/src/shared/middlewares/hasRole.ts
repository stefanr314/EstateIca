import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../errors";

export const hasRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ForbiddenError(
        "You do not have permission to access this resource"
      );
    }

    next();
  };
};
