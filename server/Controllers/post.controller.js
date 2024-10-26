import { Post } from "../models/postModel.js";
import { throwError } from "../utils/HttpError.js";
import mongoose, { Types } from "mongoose";
import tryCatch from "../utils/TryCatch.js";
import {
  buildAggProject,
  paginateHelper,
  postAggCommonStages,
} from "../utils/queryHelpers.js";
import { removeImgInBackground } from "../lib/cloudinary-service.js";
import { v2 as cloudinary } from "cloudinary";
import { checkAssign } from "../utils/generalUtils.js";
import { sanitizeHTML } from "../lib/sanatize-html.js";
const ObjectId = mongoose.Types.ObjectId;
const isValidId = ObjectId.isValid;

export const createPost = tryCatch(async (req, res) => {
  let { title, content, tags } = req.body;
  if (typeof content === "string") content = sanitizeHTML(content);
  const post = new Post({ title, content, author: req.userId, tags });
  if (req.file) {
    post.coverImg = {
      url: req.file.path,
      publicId: req.file.filename,
    };
  }
  await post.save();
  res.status(201).json({ post: post });
});

export const getPosts = tryCatch(async (req, res) => {
  let { cursor, select = "-content", user, tag } = req.query;
  const matchQuery = {};
  if (isValidId(user || "")) matchQuery.author = new ObjectId(user);
  if (tag) matchQuery.tags = tag;

  const posts = await Post.aggregate([
    { $match: matchQuery },
    ...paginateHelper.paginateStage(cursor),
    ...postAggCommonStages(req.userId || 0),
    { $project: buildAggProject(select) },
  ]);

  res.status(200).json({
    results: posts,
    total: posts.length,
    nextPageCursor: paginateHelper.buildCursor(posts),
  });
});

export const getPostBySlug = tryCatch(async (req, res) => {
  const { slug } = req.params;
  const id = req.params.slug.split("-").at(-1);
  if (!isValidId(id)) throwError("Post not exits or deleted", 404);
  //For quick search
  const postId = new Types.ObjectId(id);
  const posts = await Post.aggregate([
    { $match: { _id: postId } },
    { $limit: 1 },
    ...postAggCommonStages(req.userId || 0),
  ]);
  if (posts[0]?.slug !== slug) {
    throwError("Post not exits or deleted", 404);
  }

  res.json({
    results: posts[0],
  });
});

export const getSinglePost = tryCatch(async (req, res, next) => {
  const postId = new Types.ObjectId(req.params.postId);
  const post = await Post.aggregate([
    { $match: { _id: postId } },
    { $limit: 1 },
    ...postAggCommonStages(req.userId || 0),
  ]);
  if (!post[0]) throwError("Unable to find post", 400);

  res.json({
    results: post[0],
  });
});

export const deletePost = tryCatch(async (req, res) => {
  const isDelete = await Post.findOneAndDelete({
    _id: req.params.postId,
    author: req.userId,
  }).select("_id");

  if (!isDelete) throwError("Unable to find post", 400);
  Like.deleteMany({ onPost: doc._id }).catch(() =>
    console.log(`Failed to remove the likes of deleted post ${doc._id}`)
  );
  Comment.deleteMany({ post: doc._id }).catch(() =>
    console.log(`Failed to remove the comments of deleted post ${doc._id}`)
  );
  res.status(200).json({ message: "OK" });
});

export const updatedPost = tryCatch(async (req, res) => {
  let { coverImg, content } = req.body;

  const postId = req.params.postId;
  let post = await Post.findOne({ _id: postId, author: req.userId });
  if (!post) {
    throw "Post not exits or you are not authorized to perform this action";
  }
  let oldImgId = post.coverImg?.publicId;

  if (req.file) {
    post.coverImg = {
      url: req.file.path,
      publicId: req.file.filename,
    };
  } else if (coverImg === "remove" || coverImg === null) {
    post.coverImg = undefined;
  }
  if (typeof content === "string") post.content = sanitizeHTML(content);

  checkAssign(post, req.body, ["title", "tags"]);

  await post.save();

  if (oldImgId && post.coverImg?.publicId !== oldImgId) {
    removeImgInBackground(oldImgId, "OLD_POST_IMAGE_REMOVE");
  }

  res.status(201).json({ post });
});
//TODO - fix pagination issue
export const searchPost = tryCatch(async (req, res) => {
  const { text } = req.params;
  const { cursor } = req.query;
  let fetchAfter = {};

  if (cursor) {
    let [lastPagetId, lastPostScore] = cursor.split(";");
    // sorting with createdAt and taking using lastPostId as a tiebreaker
    if (isValidId(lastPagetId) && !isNaN(lastPostScore)) {
      fetchAfter = {
        $or: [
          { score: { $lt: +lastPostScore } },
          {
            score: +lastPostScore,
            _id: { $lt: new ObjectId(lastPagetId) },
          },
        ],
      };
    }
  }

  const posts = await Post.aggregate([
    {
      $search: {
        compound: {
          should: [
            {
              text: {
                query: text,
                path: "title",
                fuzzy: { maxEdits: 1 },
                score: { boost: { value: 3 } },
              },
            },
            {
              text: {
                query: text,
                path: "tags",
                fuzzy: { maxEdits: 1 },
              },
            },
          ],
        },
        // sort: { score: -1 },
        highlight: {
          path: ["title", "tags"],
        },
        // scoreDetails: true,
      },
    },
    {
      $set: {
        score: { $meta: "searchScore" },
        // highlights: {
        //   $meta: "searchHighlights",
        // },
        // paginationToken: { $meta: "searchSequenceToken" },
        // scoreDetails: { $meta: "searchScoreDetails" },
      },
    },
    { $sort: { score: -1, _id: -1 } },
    { $match: fetchAfter },
    { $limit: 10 },
    ...postAggCommonStages(req.userId || 0),
    { $unset: ["content"] },
  ]);

  const lastPost = posts.at(-1);
  const nextPageCursor =
    posts.length >= 10 ? lastPost._id + ";" + lastPost.score : null;

  res.json({
    results: posts,
    total: posts.length,
    nextPageCursor,
  });
});
