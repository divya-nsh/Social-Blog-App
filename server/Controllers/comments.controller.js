import tryCatch from "../utils/TryCatch.js";
import { Comment } from "../models/commentModel.js";
import { Post } from "../models/postModel.js";
import { throwError } from "../utils/HttpError.js";
import { commentsAggBaseStage, paginateHelper } from "../utils/queryHelpers.js";
import { Like } from "../models/LikeModel.js";

export const createComment = tryCatch(async (req, res) => {
  let { postId } = req.params;
  const { content } = req.body;
  const post = await Post.findById(postId).select("author");
  if (!post) throwError("Post not exits", 404);

  let comment = await Comment.create({
    post: postId,
    postAuthor: post.author,
    content,
    author: req.userId,
  });

  await comment.populate("author", "_id username image fullName");

  let results = {
    ...comment.toObject(),
    isViewerAuthor: true,
    isCommentAuthorPostAuthor:
      comment.postAuthor + "" === comment.author._id + "",
  };

  res.status(201).json({ results });
});

export const deleteComment = tryCatch(async (req, res) => {
  let { commentId } = req.params;

  const comment = await Comment.findOneAndDelete({
    _id: commentId,
    author: req.userId,
  }).select("_id");

  if (!comment) throwError("Comment not exits", 404);

  Like.deleteMany({ commentId }).catch(() => {
    console.log(`Failed to remove the likes of comment ${commentId}`);
  });

  res.json({ message: "Comment Deleted" });
});

export const updateComment = tryCatch(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  const comment = await Comment.findByIdAndUpdate(
    commentId,
    { content },
    { new: true }
  );

  if (!comment) throwError("Comment with given id not exits", 400);

  await comment.populate("author", "_id username image fullName");

  res.json({ comment });
});

export const getComments = tryCatch(async (req, res) => {
  const { postId } = req.params;
  const { cursor } = req.query;

  const comments = await Comment.aggregate([
    { $match: { post: postId } },
    ...paginateHelper.paginateStage(cursor),
    ...commentsAggBaseStage(req.userId),
  ]);

  res.status(200).json({
    results: comments,
    total: comments.length,
    nextPageCursor: paginateHelper.buildCursor(comments),
  });
});

export const getComment = tryCatch(async (req, res) => {
  const { commentId } = req.params;
  const comment = await Comment.aggregate([
    { $match: { commentId } },
    { $limit: 1 },
    ...commentsAggBaseStage,
  ]);
  if (!comment[0]) throwError("Comment with given id not exits", 400);
  res.status(200).json({ comment: comment[0] });
});
