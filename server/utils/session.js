import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { SESSION_AGE } from "./constant.js";

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

export function createSessionToken(user) {
  return generateAuthToken(user, SESSION_AGE);
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
