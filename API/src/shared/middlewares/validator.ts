import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../errors";
declare module "express-serve-static-core" {
  interface Request {
    validated?: {
      query?: any;
    };
  }
}
export const validate =
  (schema: ZodSchema, target: "body" | "query" | "params" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      next(result.error);
      return;
    }

    // Overwrite original request object with parsed (and sanitized) data

    if (target === "query") {
      req.validated ??= {};
      req.validated["query"] = result.data; // because query is only getter
    } else req[target] = result.data; // ✅ za body i params

    next();
  };
