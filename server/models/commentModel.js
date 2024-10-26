import { Schema, model } from "mongoose";

const commentSchema = new Schema(
  {
    post: { type: Schema.Types.ObjectId, required: true },
    postAuthor: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    content: { type: String, required: true, maxlength: 2000 },
  },
  {
    timestamps: true,
  }
);

export const Comment = model("Comment", commentSchema);
