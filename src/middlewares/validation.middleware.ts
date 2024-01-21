import { NextFunction, Request, Response } from "express";
import { Schema } from "zod";

export function ValidateRequestMiddleware(schema: Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = schema.parse(req.body);
      req.body = body;
      next();
    } catch (error) {
      next(error);
    }
  };
}
