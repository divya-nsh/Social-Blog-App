import tryCatch from "../utils/TryCatch.js";
import { User } from "../models/userModel.js";
import { throwError } from "../utils/HttpError.js";
import bcrypt from "bcrypt";
import {
  createSessionToken,
  generateAuthToken,
  verifyAuthToken,
} from "../utils/session.js";
import { Post } from "../models/postModel.js";
import { paginateHelper } from "../utils/queryHelpers.js";
import {
  checkAssign,
  generateAvatar,
  isValidEmail,
} from "../utils/generalUtils.js";
import { removeImg } from "../lib/cloudinary-service.js";
import {
  mailResetPasswordDone,
  mailResetPasswordToken,
} from "../lib/mailClient.js";
import { OAuth2Client } from "google-auth-library";

function flatternUser(user, removeEmail = false, isMe) {
  delete user.password;
  delete user.__v;
  delete user.pv;
  removeEmail && delete user.email;
  let res = {
    ...(user.toObject ? user.toObject() : user),
    imageUrl: user.image.url,
    imageId: user.image.publicId,
  };
  if (isMe) res.isViewerProfile = true;
  return res;
}

export const createUser = tryCatch(async (req, res) => {
  const { fullName, email, password, username } = req.body;
  const user = await User.create({
    fullName,
    email,
    password,
    username,
    image: {
      url: generateAvatar(fullName),
    },
  });

  res.status(201).json({
    user: flatternUser(user, true),
    authToken: createSessionToken(user),
  });
});

export const handleLogin = tryCatch(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throwError("email & password both required", 400);
  if (!isValidEmail(email)) throwError("Invalid Email address", 400);

  const user = await User.findOne({ email });
  if (!user) throwError("Account with given email doesn't exist", 400);
  const match = await bcrypt.compare(password, user.password);
  if (!match) throwError("Incorrect password", 400);

  res.status(200).json({
    user: flatternUser(user, true),
    authToken: createSessionToken(user),
  });
});

export const forgotPassword = tryCatch(async (req, res) => {
  const { email } = req.body;
  if (!email) throwError("Email is required", 400);
  if (!isValidEmail(email)) throwError("Invalid Email");
  const user = await User.findOne({ email });
  if (!user) throwError("Account with given email not exists", 400);
  let token = generateAuthToken(user, "15m", "reset-password");
  await mailResetPasswordToken(email, token, user.username).catch(console.log);
  res.status(200).json({ message: "Password reset token sent to your email" });
});

export const resetPassword = tryCatch(async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    throwError("token & newPassword both required", 400);
  }
  const data = await verifyAuthToken(token, "reset-password");
  if (!data) throwError("Invalid token or expired", 400);
  const user = await User.findOneAndUpdate(
    { _id: data.userId },
    {
      password: newPassword,
      isVerified: true,
    }
  );
  mailResetPasswordDone(user.email, user.username).catch(console.log);
  res.status(200).json({
    message: "Password changed",
  });
});

export const updatePassword = tryCatch(async (req, res) => {
  const { password, newPassword } = req.body;
  if (!password || !newPassword)
    throwError("password & newPassword both required", 400);
  const user = await User.findById(req.userId);
  if (!user) throwError("User not found", 400);
  const match = await bcrypt.compare(password, user.password);
  if (!match) throwError("Incorrect Current password", 400);
  user.password = newPassword;
  await user.save();
  res.status(200).json({
    authToken: createSessionToken(user),
    message: "Password updated. old session is invalid now",
  });
});

//Get Login user
export const getUser = tryCatch(async (req, res) => {
  res.status(200).json({
    results: flatternUser(req.user, false, true),
  });
});

export const getUserByUsername = tryCatch(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  if (!user) throwError("User not found!", 404);
  const isOwnProfile = user._id?.toString() === req.userId?.toString();
  const total_posts = await Post.countDocuments({ author: user._id });

  res.status(200).json({
    results: {
      ...flatternUser(user, true, isOwnProfile),
      total_posts,
    },
  });
});

export const searchUser = tryCatch(async (req, res) => {
  const { searchText } = req.params;
  const { cursor } = req.query;
  const matchQuery = {
    $or: [
      { username: { $regex: searchText, $options: "i" } },
      { fullName: { $regex: searchText, $options: "i" } },
    ],
  };

  let users = await User.aggregate([
    { $match: matchQuery },
    ...paginateHelper.paginateStage(cursor),
    { $project: { fullName: 1, username: 1, email: 1, image: 1, _id: 1 } },
  ]);

  res.status(200).json({
    results: users.map((v) => flatternUser(v, true, req.userId === v._id)),
    nextPageCursor: paginateHelper.buildCursor(users),
  });
});

export const updateProfile = tryCatch(async (req, res) => {
  let user = await User.findById(req.userId).select("-password -pv");
  if (!user) throw "something is wrong";
  let oldImgId = user.image?.publicId;
  checkAssign(user, req.body, [
    "fullName",
    "bio",
    "socialLinks",
    "username",
    "email",
  ]);

  if (req.file) {
    user.image = { url: req.file.path, publicId: req.file.filename };
  }

  await user.save();

  if (user.image?.publicId !== oldImgId) {
    removeImg(oldImgId, "OLD_USER_IMAGE_REMOVE", true);
  }

  res.status(200).json({ results: flatternUser(user, false, true) });
});

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage"
);

export const authWithGoogle = tryCatch(async (req, res) => {
  let { idToken, code } = req.body;
  if (code) {
    const { tokens } = await googleClient.getToken(code);
    idToken = tokens.id_token;
  }

  if (!idToken) throwError("IdToken Required", 400);

  const token = await googleClient.verifyIdToken({
    idToken,
    audience: googleClient._clientId, // Specify the CLIENT_ID of the app that accesses the backend
  });

  const { email, name, email_verified, picture } = token.getPayload();
  let user = await User.findOne({ email });

  if (!user) {
    let newUser = await User.create({
      email,
      fullName: name,
      isVerified: email_verified,
      password: Math.random().toString(36).slice(2),
    });
    if (picture) newUser.image = { url: picture };
    await newUser.save();
    user = newUser;
  }

  res.status(200).json({
    user: flatternUser(user, true),
    authToken: createSessionToken(user),
  });
});
