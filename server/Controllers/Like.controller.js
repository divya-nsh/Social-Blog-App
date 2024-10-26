import { Comment } from "../models/commentModel.js";
import { Like } from "../models/LikeModel.js";
import { Post } from "../models/postModel.js";
import { throwError } from "../utils/HttpError.js";
import tryCatch from "../utils/TryCatch.js";

export const likePost = tryCatch(async (req, res) => {
  const postId = req.params.postId;
  const isPostExits = await Post.exists({ _id: postId });
  if (!isPostExits) throwError("Invalid post id", 400);
  let doc = {
    postId,
    likedBy: req.userId,
    commentId: null,
  };
  await Like.findOneAndUpdate(doc, doc, { upsert: true }); //Create if not exits
  res.status(200).json({ message: "Post is liked" });
});

export const dislikePost = tryCatch(async (req, res) => {
  const postId = req.params.postId;
  await Like.findOneAndDelete({ postId, likedBy: req.userId, commentId: null }); //Delete i exits
  res.status(200).json({ message: "Post like is removed" });
});

export const likeComment = tryCatch(async (req, res) => {
  const { commentId } = req.params;
  const comment = await Comment.findById(commentId);

  if (!comment) throwError("Invalid Comment id", 400);
  let doc = {
    postId: comment.post,
    commentId,
    likedBy: req.userId,
  };

  await Like.findOneAndUpdate(doc, doc, { upsert: true });
  res.status(200).json({ message: "Comment is liked" });
});

export const dislikeComment = tryCatch(async (req, res) => {
  const { commentId } = req.params;
  await Like.findOneAndDelete({ likedBy: req.userId, commentId });
  res.status(200).json({ message: "Comment like is removed" });
});
