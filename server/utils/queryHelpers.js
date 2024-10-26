//@ts-check
import mongoose, { isValidObjectId } from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

//Aggegation Pipeline States----->

export function buildAggProject(select = "") {
  if (typeof select !== "string") return;
  let projection = { __v: 0 };
  if (select) {
    //@ts-ignore
    projection = {};
    const selectedFields = select.split(",");
    selectedFields.forEach((field) => {
      if (field[0] === "-") {
        //Exculde
        projection[field.substring(1)] = 0;
      } else {
        //include
        projection[field] = 1;
      }
    });
  }
  return projection;
}

/**
 * @type {()=>mongoose.PipelineStage[]}
 */
export function populateAuthor() {
  return [
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
        pipeline: [
          {
            $project: {
              fullName: 1,
              username: 1,
              image: 1,
              bio: 1,
              imageUrl: "$image.url",
              imagePublicId: "$image.publicId",
            },
          },
        ],
      },
    },
    { $unwind: "$author" },
  ];
}

/**
 * @type {(type:"post"|"comment",userId?:mongoose.ObjectId)=>mongoose.PipelineStage[]}
 */
export function populateLike(type = "post", userId) {
  let foreignField = type === "post" ? "postId" : "commentId";

  return [
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField,
        as: "likes",
        pipeline: [{ $match: type === "post" ? { commentId: null } : {} }],
      },
    },

    {
      $set: {
        likesCount: { $size: "$likes" },
        isUserLiked: { $in: [userId, "$likes.likedBy"] },
      },
    },
    { $unset: ["likes"] },
  ];
}

/**
 * @type {(userId?:mongoose.ObjectId)=>mongoose.PipelineStage[]}
 */
export function populateBookmaredStatus(userId) {
  return userId
    ? [
        {
          $lookup: {
            from: "bookmarks",
            localField: "_id",
            foreignField: "post",
            as: "isBookmarked",
            pipeline: [{ $match: { bookmarkedBy: userId } }, { $limit: 1 }],
          },
        },
        { $set: { isBookmarked: { $eq: [{ $size: "$isBookmarked" }, 1] } } },
      ]
    : [{ $set: { isBookmarked: false } }];
}

/**
 * @type {()=>mongoose.PipelineStage[]}
 */
export function populateCommentsCount() {
  return [
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "post",
        as: "commentsCount",
      },
    },
    {
      $set: {
        commentsCount: { $size: "$commentsCount" },
      },
    },
  ];
}

/**
 * @type {(userId?:mongoose.ObjectId)=>mongoose.PipelineStage[]}
 *  Suppose to be use after pagination stage
 */
export function postAggCommonStages(userId) {
  return [
    ...populateAuthor(),
    ...populateLike("post", userId),
    ...populateBookmaredStatus(userId),
    ...populateCommentsCount(),
    {
      $set: {
        isViewerAuthor: { $eq: [userId, "$author._id"] },
        coverImgUrl: "$coverImg.url",
        coverImageId: "$coverImg.publicId",
      },
    },
  ];
}

/**
 * @param {mongoose.ObjectId} userId
 * @returns {mongoose.PipelineStage[]}
 * Suppose to be use after pagination stage
 */
export function commentsAggBaseStage(userId) {
  return [
    ...populateAuthor(),
    ...populateLike("comment", userId),
    {
      $set: {
        isViewerAuthor: { $eq: [userId, "$author._id"] },
        isCommentAuthorPostAuthor: { $eq: ["$postAuthor", "$author._id"] },
      },
    },
  ];
}

//Others Query------------------>
export const paginateHelper = {
  limit: 10,
  buildCursor(docs, createdAt = false) {
    if (docs.length < this.limit) return null;
    const lastDoc = docs.at(-1);
    if (!createdAt) return lastDoc._id;
    return lastDoc.createdAt
      ? lastDoc._id + ";" + new Date(lastDoc.createdAt).toISOString()
      : null;
  },
  cursor(docs, createdAt = false) {
    if (docs.length < this.limit) return null;
    const lastDoc = docs.at(-1);
    if (!createdAt) return lastDoc._id;
    return lastDoc.createdAt
      ? lastDoc._id + ";" + new Date(lastDoc.createdAt).toISOString()
      : null;
  },
  buildPaginateQ(cursor) {
    if (!cursor || !isValidObjectId(cursor.split(";")[0])) return {};
    let [_id, timeStamp] = cursor.split(";");

    if (timeStamp) {
      return {
        $or: [
          { createdAt: { $lt: new Date(timeStamp) } },
          {
            createdAt: new Date(timeStamp),
            _id: { $lt: new ObjectId(_id) },
          },
        ],
      };
    } else {
      return { _id: { $lt: new ObjectId(_id) } };
    }
  },
  paginateStage(cursor, timeStamp = false) {
    return [
      { $match: this.buildPaginateQ(cursor) },
      { $sort: timeStamp ? { createdAt: -1, _id: -1 } : { _id: -1 } },
      { $limit: 10 + 1 },
    ];
  },
};
