import { Schema, model } from "mongoose";

const likeSchema = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    commentId: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    likedBy: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Like = model("Like", likeSchema);
