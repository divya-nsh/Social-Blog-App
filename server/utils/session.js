import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import ms from "ms";

export const SESSION_COOKIE_NAME = "access_token";
const SESSION_AGE = process.env.SESSION_AGE || "30d";
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * @param {{_id:string,pv:string}} user
 * @param {string|number} age
 * @param {scope} string
 */
export function generateAuthToken(user, age, scope = "") {
  if (!user._id) throw new Error("User id is required");
  if (!user.pv) throw new Error("User pv is required");

  const secret = `${JWT_SECRET}${scope || ""}`;
  let payload = { userId: user._id, v: user.pv };
  const token = jwt.sign(payload, secret, {
    expiresIn: age,
  });
  return token;
}

export async function verifyAuthToken(token, scope = "") {
  const secret = `${JWT_SECRET}${scope || ""}`;
  try {
    const data = jwt.verify(token, secret);
    const user = await User.findOne({ _id: data.userId });
    if (!user || user.pv !== data.v) return null;
    return { userId: data.userId, expiredAt: data.exp * 1000, v: data.v, user };
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return null;
    }
    throw error;
  }
}

/**
 * @param {express.Response} res
 * @param {{_id:string,pv:string}} user
 * @param {string} age
 * @returns {express.Response}
 */
export function createSession(res, user, age = SESSION_AGE) {
  const token = generateAuthToken(user, age);
  return res.status(200).cookie(SESSION_COOKIE_NAME, token, {
    maxAge: ms(age + ""),
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    priority: "high",
    sameSite: "strict",
  });
}

/**
 * @type {(req:express.Response)=>express.Response}
 */
export function destroySession(res) {
  return res.status(200).clearCookie(SESSION_COOKIE_NAME);
}

/**
 * @param {express.Request} req
 */
export async function getSession(req) {
  const token = req.cookies[SESSION_COOKIE_NAME];
  if (!token) return null;
  const session = await verifyAuthToken(token);
  if (!session) return null;
  return session;
}
