import { Request, Response, NextFunction } from "express";
import { ForbiddenError, UnauthorizedError } from "../errors";

import jwt, { Jwt } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../../config/config";

interface JwtPayload {
  id: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      role: string;
      isVerified: boolean;
      isActive: boolean;
    };
  }
}

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedError("Token not provided");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET!) as JwtPayload;

    req.user = {
      id: decoded.id,
      role: decoded.role,
      isVerified: decoded.isVerified,
      isActive: decoded.isActive,
    };

    next();
  } catch (error) {
    // throw new ForbiddenError("Invalid or expired token");
    next(error);
  }
};

export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET!) as JwtPayload;
      req.user = decoded;
    } catch (err) {
      // ako token postoji ali je nevažeći → ignoriši
      req.user = undefined;
    }
  }

  next();
};
