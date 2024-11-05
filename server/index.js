"use strict";
import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user-routes.js";
import postRouter from "./routes/posts-routes.js";
import commentsRouterV2 from "./routes/comments-routes.js";
import bookmarkRouter from "./routes/bookmark-routes.js";
import LikeRouter from "./routes/like-routes.js";
import morgan from "morgan";
import { v2 as cloudinary } from "cloudinary";
import { errorRequestHandler } from "./middleware/errorHandler.js";
import { connectDB } from "./lib/connectDB.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import compression from "compression";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
// app.disable('x-powered-by')

app.use(
  cors({
    //[Access-Control-Allow-Origin]
    origin: process.env.CORS_ORIGIN.split(","),
    credentials: true,
    //[Access-Control-Allow-Methods]
    // methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    //[Access-Control-Allow-Headers]
    // allowedHeaders: ["Content-Type", "Authorization"],
    //[Access-Control-Max-Age] In seconds how long the response to the preflight request can be cached without sending another preflight request.
    maxAge: process.env.NODE_ENV === "production" ? 60 * 60 : 0, //In seconds 1 hour
    // exposedHeaders: ["Content-Length", "Content-Encoding"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

app.use(morgan("tiny"));

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/user", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments/v2", commentsRouterV2);
app.use("/api/bookmarks", bookmarkRouter);
app.use("/api/like", LikeRouter);

app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorRequestHandler);

app.listen(process.env.PORT_NO || 3000, async (err) => {
  console.log(`Server is running on port ${3000}`);
  await connectDB();
});
