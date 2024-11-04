import { HttpError } from "../utils/HttpError.js";
import mongoose from "mongoose";
import { SESSION_COOKIE_NAME, verifyAuthToken } from "../utils/session.js";

/**
 * @type {import("express").RequestHandler}
 */
export async function authorizaiton(req, res, next) {
  try {
    let token = req.cookies[SESSION_COOKIE_NAME];
    const authHeader = req.headers["authorization"];
    if (authHeader && authHeader.split(" ")[1]) {
      token = authHeader.split(" ")[1];
    }
    if (!token) return next(new HttpError("Unauthorized", 401));
    const data = await verifyAuthToken(token);
    if (!data) return next(new HttpError("Unauthorized", 401));
    req.userId = new mongoose.Types.ObjectId(data.userId);
    req.user = data.user;

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * @type {import("express").RequestHandler}
 */
export async function passUserId(req, res, next) {
  try {
    const token = req.cookies[SESSION_COOKIE_NAME];
    const authHeader = req.headers["authorization"];
    if (authHeader && authHeader.split(" ")[1]) {
      token = authHeader.split(" ")[1];
    }
    if (token) {
      const data = await verifyAuthToken(token);
      if (data) {
        req.userId = new mongoose.Types.ObjectId(data.userId);
        req.user = data.user;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
}
