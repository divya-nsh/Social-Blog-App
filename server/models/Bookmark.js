import mongoose from "mongoose";

export const bookmarkSchema = new mongoose.Schema({
  post: { type: mongoose.Types.ObjectId, required: true },
  postAuthor: { type: mongoose.Types.ObjectId, required: true },
  bookmarkedBy: { type: mongoose.Types.ObjectId, required: true },
});

export const Bookmark = mongoose.model("bookmark", bookmarkSchema);
