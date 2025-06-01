import { Request, Response, NextFunction } from "express";
import { ForbiddenError, UnauthorizedError } from "../errors";

import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../../config/config";

interface JwtPayload {
  id: string;
  role: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      role: string;
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
    };

    next();
  } catch (error) {
    // throw new ForbiddenError("Invalid or expired token");
    next(error);
  }
};

// const authenticate = (req, res, next) => {
//   const accessToken = req.headers["authorization"];
//   const refreshToken = req.cookies["refreshToken"];

//   if (!accessToken && !refreshToken) {
//     return res.status(401).send("Access Denied. No token provided.");
//   }

//   try {
//     const decoded = jwt.verify(accessToken, secretKey);
//     req.user = decoded.user;
//     next();
//   } catch (error) {
//     if (!refreshToken) {
//       return res.status(401).send("Access Denied. No refresh token provided.");
//     }

//     try {
//       const decoded = jwt.verify(refreshToken, secretKey);
//       const accessToken = jwt.sign({ user: decoded.user }, secretKey, {
//         expiresIn: "1h",
//       });

//       res
//         .cookie("refreshToken", refreshToken, {
//           httpOnly: true,
//           sameSite: "strict",
//         })
//         .header("Authorization", accessToken)
//         .send(decoded.user);
//     } catch (error) {
//       return res.status(400).send("Invalid Token.");
//     }
//   }
// };
