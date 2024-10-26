import { CancelToken } from "axios";
import { IEditUser, InfinityApiRes, IPost, User } from "../types/indext";
import makeRq from "@/lib/makeRq";

export async function login(body: { email: string; password: string }) {
  const res = await makeRq.post("api/user/login", body);
  return res.data as { user: User };
}

export async function reqResetPass(email: string) {
  await makeRq.post("api/user/forgot-password", { email });
}

export async function resetPassword(data: {
  newPassword: string;
  token: string;
}) {
  const res = await makeRq.post("api/user/reset-password", data);
  return res.data.results as User;
}

export async function getMe(cancelToken?: CancelToken) {
  const res = await makeRq.get("api/user/me", { cancelToken });
  return res.data.results as User;
}

export async function createUser(body: {
  email: string;
  password: string;
  fullName: string;
}) {
  const res = await makeRq.post("api/user/signup", body);
  return res.data as { user: User };
}

export async function updateProfile(
  fields: IEditUser | FormData,
  onUploadProgress?: (uploadRate: number) => void,
) {
  const res = await makeRq.put(`api/user/me`, fields, {
    onUploadProgress(progressEvent) {
      if (!progressEvent.total) return;
      const percentComplete = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total,
      );
      onUploadProgress?.(percentComplete);
    },
  });
  return res.data.results as User;
}

export async function uploadProfileImg({
  file,
  onUploadProgress,
}: {
  file: File;
  onUploadProgress?: (uploadRate: number) => void;
}) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await makeRq.put(`api/user/me`, formData, {
    onUploadProgress(progressEvent) {
      if (!progressEvent.total) return;
      const percentComplete = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total,
      );
      onUploadProgress?.(percentComplete);
    },
  });

  return res.data.results as User;
}

export async function updatePassword(body: {
  currPass: string;
  newPass: string;
}) {
  await makeRq.patch(`api/user/change-password/me`, {
    password: body.currPass,
    newPassword: body.newPass,
  });
}

export async function getUserByUsername(username: string) {
  const res = await makeRq(`api/user/${username}`);
  return res.data.results as User;
}

export async function getLoginUser() {
  const res = await makeRq.get(`api/user/`);
  return res.data;
}

export async function searchUser(
  searchText: string,
  nextPageCursor?: string | null,
) {
  let url = `api/user/${searchText}/search`;
  if (nextPageCursor) url += `?cursor=${nextPageCursor}`;
  const res = await makeRq.get<InfinityApiRes<User>>(url);
  return res.data;
}

export async function getUserPosts(userId: string) {
  const res = await makeRq.get<InfinityApiRes<IPost>>(
    `api/posts/author/${userId}`,
  );
  return res.data;
}

export async function logoutApi() {
  await makeRq.post("/api/user/logout");
}
