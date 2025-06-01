import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../errors";

export const validate =
  (schema: ZodSchema, target: "body" | "query" | "params" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      next(result.error);
      return;
    }

    // Overwrite original request object with parsed (and sanitized) data
    req[target] = result.data;
    next();
  };
