import { CancelToken } from "axios";
import { BookmarkedPost, IComment, InfinityApiRes } from "../types/indext";
import { apiRq } from "@/lib/makeRq";

//---------------------------Like Api------------------------------------------//
export async function likeDislikeApi(
  type: "comment" | "post",
  docId: string,
  action: "like" | "dislike",
) {
  const method = { like: "post", dislike: "delete" };
  await apiRq(`api/like/${type}/${docId}`, { method: method[action] });
}

//--------------------------Bookmark Api--------------------------------------------//

export async function addRemoveBookmark(postId: string, add: boolean) {
  await apiRq(`api/bookmarks/${postId}`, { method: add ? "POST" : "DELETE" });
}

export async function getBookmarks(
  cursor?: string | null,
  token?: CancelToken,
) {
  const res = await apiRq.get<InfinityApiRes<BookmarkedPost>>("api/bookmarks", {
    params: cursor ? { cursor } : {},
    cancelToken: token,
  });
  return res.data;
}

//---------------------Comment Api----------------------------------//

export async function getComments({
  postId,
  cursor,
  cancelToken,
}: {
  postId: string;
  cursor?: string | null;
  cancelToken?: CancelToken;
}) {
  const res = await apiRq.get<{ results: IComment[]; nextPageCursor: string }>(
    `api/comments/v2/${postId}`,
    { params: { cursor }, cancelToken },
  );
  return res.data;
}

export async function createComment({
  postId,
  content,
}: {
  postId: string;
  content: string;
}) {
  const res = await apiRq.post(`api/comments/v2/${postId}`, { content });
  return res.data.results as IComment;
}

export async function deleteComment(commentId: string) {
  await apiRq.delete(`api/comments/v2/${commentId}`);
}
