import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { BadRequestError } from "../errors";

export function validateObjectId(paramName: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[paramName];

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError(
        `Parametar "${paramName}" nije validan ObjectId.`
      );
    }

    next();
  };
}
