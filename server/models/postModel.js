import mongoose, { Schema, model } from "mongoose";
import { createSlug } from "../utils/generalUtils.js";

/**
 * @type {import("mongoose").SchemaValidator<any>[]}
 */
const tagValidator = [
  {
    validator: (tags) => tags.length <= 5,
    message: "You can only add up to 5 tags.",
  },
  {
    validator: (tags) => {
      return tags.every((tag) => {
        return tag.length >= 2 && tag.length <= 30;
      });
    },
    message: "Each tag must be between 2 and 30 characters long.",
  },
];

const postSchema = new mongoose.Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
      maxlength: [150, "Title length must be less than 150 characters."],
      minlength: [10, "Title length must be greater than 30 characters."],
      trim: true,
    },
    content: {
      type: String,
      minlength: [50, "Content must have 50 letters"],
      required: true,
    },
    tags: {
      type: [String],
      validate: tagValidator,
      default: [],
      set: function (tags) {
        if (typeof tags === "string") {
          return tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean);
        }
        return tags.filter(Boolean);
      },
    },
    coverImg: {
      type: {
        url: { type: String },
        publicId: { type: String },
      },
      _id: false,
    },
    slug: {
      type: String,
      default() {
        return createSlug(this.title || "", this._id);
      },
      unique: true,
    },
  },
  { timestamps: true }
);

postSchema.pre("findOneAndUpdate", async function (next) {
  if (this.getOptions().runValidators === undefined) {
    this.getOptions().runValidators = true;
  }
  next();
});

export const Post = model("Post", postSchema);
