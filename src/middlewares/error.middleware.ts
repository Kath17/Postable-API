import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { formatErrors } from "../utils/formatErrors";

export class PostableError extends Error {
  statusCode: number;
  type: string;
  details: string;
  timesTamp: string;
  techInfo: string;
  constructor(
    message: string,
    statusCode: number,
    type: string,
    error?: any,
    details?: string
  ) {
    super(message);
    this.statusCode = statusCode || 500;
    this.type = type || "GeneralError";
    this.details = details || "";
    this.timesTamp = new Date().toISOString();
    const errorMessge =
      error instanceof Error ? error.message : "Detalles no disponibles";
    this.techInfo = errorMessge;
  }
}

export default function errorHandler(
  error: Error | ZodError | PostableError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (error instanceof ZodError) {
    res.status(400).json({
      ok: false,
      message: "Error en validación",
      details: formatErrors(error.formErrors.fieldErrors),
    });
  } else if (error instanceof PostableError) {
    res.status(error.statusCode).json({
      ok: false,
      message: error.message,
      details: {
        type: error.type,
        details: error.details,
        timestamp: error.timesTamp,
        techInfo: error.techInfo,
      },
    });
  } else {
    res.status(500).json({
      ok: false,
      error: {
        message: "Error interno del servidor",
      },
    });
  }
}
