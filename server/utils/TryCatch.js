import { HttpError } from "../utils/HttpError.js";
import mongoose from "mongoose";

/**
 * @param {(req:import("express").express.Request & {userId?:string},res:import("express").Response)=>Promise<void>} controller
 * @returns {import("express").RequestHandler}
 */
export default function tryCatch(controller) {
  return async (req, res, next) => {
    try {
      Object.getOwnPropertyNames(req.params).forEach((param) => {
        if (param.includes("Id") > 0) {
          if (!mongoose.Types.ObjectId.isValid(req.params[param])) {
            throw new HttpError(
              `Resources you are looking for does not exits!`,
              404
            );
          } else {
            req.params[param] = new mongoose.Types.ObjectId(req.params[param]);
          }
        }
      });
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
