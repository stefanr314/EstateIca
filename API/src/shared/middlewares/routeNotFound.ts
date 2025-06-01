import { Request, Response, NextFunction } from "express";
import logger from "../../config/pinoLogger";
import { NotFoundError } from "../errors";

export function routeNotFound(req: Request, res: Response, next: NextFunction) {
  const error = new NotFoundError(`Route not found: ${req.originalUrl}`);
  logger.error(error.message);

  next(error); // Pass the error to the next middleware (error handler)
}
