import { AxiosError } from "axios";

export interface TimeStamp {
  createdAt: string;
  updatedAt: string;
}
export interface User extends TimeStamp {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  bio: string;
  socialLinks?: SocialLinksI;
  total_posts: number;
  publishPostCount: number;
  isViewerProfile: boolean;
  image: {
    url: string;
    publicId?: string;
  };
}
export interface IPost extends TimeStamp {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  // coverImg: string;
  likesCount: number;
  commentsCount: number;
  isViewerAuthor: boolean;
  isUserLiked: boolean;
  thumbnailUrl?: string;
  coverImgUrl?: string;
  isBookmarked: boolean;
  author: Pick<User, "_id" | "fullName" | "image" | "username">;
  isDraft: boolean;
  slug?: string;
}

export interface SocialLinksI {
  instagram?: string;
  twitter?: string;
  website?: string;
  youtube?: string;
  facebook?: string;
  linkedin?: string;
}

export type IEditUser = Partial<
  Pick<User, "bio" | "fullName" | "socialLinks" | "email" | "username">
>;

export interface BookmarkedPost extends IPost {
  bookmarkedOn: string;
  bookmarkId: string;
}

export interface IComment extends TimeStamp {
  _id: string;
  post: string;
  postAuthor: string;
  author: Pick<User, "_id" | "fullName" | "image" | "username">;
  content: string;
  likesCount: number;
  isUserLiked: boolean;
  isViewerAuthor: boolean;
  isCommentAuthorPostAuthor: boolean;
}

export interface ApiError extends AxiosError<{ error: string }> {}

export type ApiState =
  | "idle"
  | "pending"
  | "error"
  | "success"
  | "feching_more";

export interface CreatePostT {
  editPostId?: null;
  content: string;
  title: string;
  tags?: string[];
  coverImg?: { publicId: string } | File | null;
  coverImgUrl?: string | null;
}

export interface EditPostT {
  editPostId: string;
  content?: string;
  title?: string;
  tags?: string[];
  coverImg?: { publicId: string } | File | null;
  coverImgUrl?: string | null;
}

export type EditCreatePostT = CreatePostT | EditPostT;

export interface InfinityApiRes<T> {
  totalPosts: number;
  nextPageCursor: string | null;
  results: T[];
}
