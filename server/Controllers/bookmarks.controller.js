import { Bookmark } from "../models/Bookmark.js";
import { Post } from "../models/postModel.js";
import { throwError } from "../utils/HttpError.js";
import tryCatch from "../utils/TryCatch.js";
import { paginateHelper, postAggCommonStages } from "../utils/queryHelpers.js";

export const createBookmark = tryCatch(async (req, res) => {
  const postId = req.params.postId;
  const post = await Post.findById(postId).select("author");
  if (!post) throwError(404, "Post not found");
  let query = {
    bookmarkedBy: req.userId,
    post: postId,
  };

  await Bookmark.findOneAndUpdate(
    query,
    {
      $setOnInsert: {
        ...query,
        postAuthor: post.author,
      },
    },
    { upsert: true }
  );

  res.status(200).json({ message: "Bookmarked", success: true });
});

export const removeBookmark = tryCatch(async (req, res) => {
  const { postId } = req.params;
  await Bookmark.deleteOne({ bookmarkedBy: req.userId, post: postId });
  res.status(200).json({ message: "Bookmark removed", success: true });
});

export const getBookmarkPosts = tryCatch(async (req, res) => {
  const userId = req.userId;
  const { cursor } = req.query;

  const bookmarks = await Bookmark.aggregate([
    { $match: { bookmarkedBy: userId } },
    ...paginateHelper.paginateStage(cursor),
    {
      $lookup: {
        from: "posts",
        localField: "post",
        foreignField: "_id",
        as: "post",
        pipeline: [{ $limit: 1 }, ...postAggCommonStages(req.userId)],
      },
    },
    { $unwind: "$post" },
  ]);

  let flatternBookmarks = bookmarks.map((bookmark) => ({
    ...bookmark.post,
    bookmarkId: bookmark._id,
    bookmarkedOn: bookmark.createdAt,
    isBookmarked: true,
  }));

  res.json({
    results: flatternBookmarks,
    nextPageCursor: paginateHelper.buildCursor(bookmarks),
  });
});

export const getBookmarkCount = tryCatch(async (req, res) => {
  const userId = req.userId;
  const count = await Bookmark.countDocuments({ bookmarkedBy: userId });
  res.json({ bookmarkCount: count });
});
