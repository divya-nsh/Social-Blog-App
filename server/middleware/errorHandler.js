import mongoose from "mongoose";
import { MulterError } from "multer";
import { HttpError } from "../utils/HttpError.js";
import { removeImg } from "../lib/cloudinary-service.js";

/**
 * @type {import("express").Express.ErrorRequestHandler}
 */
// eslint-disable-next-line no-unused-vars
export function errorRequestHandler(error, req, res, next) {
  let flatternError;
  if (req.file) {
    removeImg(req.file?.filename, true);
  }

  if (error instanceof mongoose.Error.ValidationError) {
    flatternError = {
      status: 400,
      error: error.message,
    };
  } else if (
    error instanceof mongoose.mongo.MongoServerError &&
    error.code === 11000
  ) {
    flatternError = {
      status: 409,
      error: `${Object.keys(error.keyPattern)[0]} aldready exits`,
    };
  } else if (error instanceof MulterError) {
    flatternError = {
      error: error.message,
      code: error.code,
      status: 400,
    };
  } else if (
    error instanceof SyntaxError &&
    error.status === 400 &&
    "body" in error
  ) {
    flatternError = {
      error: "Invalid JSON",
      status: 400,
    };
  } else if (typeof error === "string") {
    flatternError = {
      error: error,
      status: 400,
    };
  } else if (Array.isArray(error)) {
    let [message, status = 500] = error;
    flatternError = { error: message, status };
  } else if (error instanceof HttpError) {
    flatternError = {
      error: error.message,
      status: error.status,
      code: error.code,
    };
  }

  if (flatternError) {
    res.status(flatternError.status || 500).json(flatternError);
  } else {
    console.log("Server Side Error Occur:", error);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}

// export const codes = {
//   VALIDATION_ERROR: "VALIDATION_ERROR",
//   DUPLICATION_ERROR: "DUPLICATION_ERROR",
//   INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
//   INPUT_PARSE_ERROR: "INPUT_PARSE_ERROR",
//   NOT_FOUND: "NOT_FOUND",
//   NOT_AUTHORIZED: "NOT_AUTHORIZED",
//   FORBIDDEN: "FORBIDDEN",
//   MAX_OTP_HIT: "MAX_OTP_HIT",
//   ERROR: "ERROR",
//   TIMEOUT: "TIMEOUT",
//   PRECONDITION_FAILED: "PRECONDITION_FAILED",
//   PAYLOAD_TOO_LARGE: "PAYLOAD_TOO_LARGE",
//   METHOD_NOT_SUPPORTED: "METHOD_NOT_SUPPORTED",
//   UNPROCESSABLE_CONTENT: "UNPROCESSABLE_CONTENT",
//   TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
//   CLIENT_CLOSED_REQUEST: "CLIENT_CLOSED_REQUEST",
//   INSUFFICIENT_CREDITS: "INSUFFICIENT_CREDITS",
//   PAYMENT_REQUIRED: "PAYMENT_REQUIRED",
//   VERIFICATION_TOKEN_SEND: "VERIFICATION_TOKEN_SEND",
//   CONFLICT: "CONFLICT",
// };
