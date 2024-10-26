import { CancelToken } from "axios";
import { EditCreatePostT, InfinityApiRes, IPost } from "../types/indext";
import makeRq from "@/lib/makeRq";

interface options {
  tag?: string;
  isDraft?: boolean;
  user?: string;
  cursor?: string | null;
  select?: string;
}

export async function getPosts(params: options = {}, token?: CancelToken) {
  return makeRq
    .get<InfinityApiRes<IPost>>("api/posts", {
      params,
      cancelToken: token,
    })
    .then((res) => res.data);
}

export async function getPostsByUser({
  userId,
  cursor,
}: {
  cursor?: string | null;
  userId: string;
}) {
  const res = await makeRq.get<InfinityApiRes<IPost>>(
    `api/posts/author/${userId}`,
    { params: cursor ? { cursor } : {} },
  );
  return res.data;
}

export async function searchPosts({
  text,
  cursor,
}: {
  text: string;
  cursor?: string | null;
}) {
  const res = await makeRq.get<InfinityApiRes<IPost>>(
    `api/posts/search/${text}?cursor=${cursor}`,
  );
  return res.data;
}

export async function getPost(id: string) {
  return makeRq
    .get<{ results: IPost }>(`api/posts/${id}`)
    .then((res) => res.data.results);
}

export async function getPostBySlug(slug: string) {
  return makeRq
    .get<{ results: IPost }>(`api/posts/slug/${slug}`)
    .then((res) => res.data.results);
}

export async function deletePost(postId: string) {
  await makeRq.delete(`api/posts/${postId}`);
}

export async function createEditPost(
  body: EditCreatePostT,
  onUploadProgress?: (rate: number) => void,
) {
  let data: FormData | EditCreatePostT = body;
  if (body.coverImg instanceof File) {
    const formData = new FormData();
    formData.append("image", body.coverImg);
    Object.entries(body).forEach(
      ([key, value]: [string, string | Array<string>]) => {
        if (!["title", "content", "tags"].includes(key)) return;
        formData.append(key, value + "");
      },
    );
    data = formData;
  }

  return makeRq<{ post: IPost }>({
    url: `api/posts/${body.editPostId || ""}`,
    data,
    method: body.editPostId ? "PUT" : "POST",
    onUploadProgress(progressEvent) {
      onUploadProgress?.(
        Math.round((progressEvent.loaded / (progressEvent?.total || 0)) * 100),
      );
    },
  }).then((res) => res.data.post);
}
