import { HttpError } from "../utils/HttpError.js";
import mongoose from "mongoose";
import {
  createSession,
  SESSION_COOKIE_NAME,
  verifyAuthToken,
} from "../utils/session.js";
import ms from "ms";

/**
 * @type {import("express").RequestHandler}
 */
export async function authorizaiton(req, res, next) {
  try {
    const token = req.cookies[SESSION_COOKIE_NAME];
    if (!token) return next(new HttpError("Unauthorized", 401));
    const data = await verifyAuthToken(token);
    if (!data) return next(new HttpError("Unauthorized", 401));
    req.userId = new mongoose.Types.ObjectId(data.userId);
    req.user = { _id: req.userId };
    let ageLeft = data.expiredAt - Date.now();
    if (ageLeft > 0 && ageLeft < ms("1d")) {
      //Extend session
      createSession(res, { _id: data.userId, pv: data.v }, "2d");
    }
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
    if (token) {
      const data = await verifyAuthToken(token);
      if (data) {
        req.userId = new mongoose.Types.ObjectId(data.userId);
        req.user = { _id: req.userId };
        let ageLeft = data.expiredAt - Date.now();
        if (ageLeft > 0 && ageLeft < ms("1d")) {
          createSession(res, { _id: data.userId, pv: data.v }, "2d");
        }
      }
    }

    next();
  } catch (error) {
    next(error);
  }
}
