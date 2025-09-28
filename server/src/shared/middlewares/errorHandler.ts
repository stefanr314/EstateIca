import { NextFunction, Request, Response } from "express";
import { ZodError, z } from "zod/v4";
import { CustomError } from "../errors";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Check if the response has already been sent
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof ZodError) {
    const formatted = err.issues.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    }));

    logging.error(z.prettifyError(err));
    // Log the error in a structured way

    res.status(400).json({
      status: "Failed",
      message: "Validacija nije uspjesna",
      errors: formatted, // Array of { path, message, ... }
      stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
    });
    return;
  }

  if (err instanceof CustomError) {
    res.status(err.statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
    });
    return;
  }

  // 🔥 JWT errors
  if (err instanceof Error) {
    if (err.name === "TokenExpiredError") {
      res.status(401).json({
        message: "Token je istekao",
        stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
      });
      return;
    }

    if (err.name === "JsonWebTokenError") {
      res.status(401).json({
        message: "Token nije validan",
        stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
      });
      return;
    }

    if (err.name === "NotBeforeError") {
      res.status(401).json({
        message: "Token jos uvijek nije aktivan",
        stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
      });
      return;
    }
  }

  // Fallback za sve ostale nepoznate greške
  const message = err instanceof Error ? err.message : "Unknown error";
  const stack = err instanceof Error ? err.stack : undefined;

  res.status(500).json({
    message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : stack,
  });
}
