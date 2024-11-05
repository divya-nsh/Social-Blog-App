/* eslint-disable @typescript-eslint/no-unused-vars */
import { createEditPost } from "@/Apis/posts-apis";
import { wait } from "@/lib/utils";
import { ApiError, EditCreatePostT, IPost } from "@/types/indext";
import {
  MutateOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useSavePostMut = (
  opt: Omit<MutateOptions<IPost, ApiError, EditCreatePostT>, "mutationFn">,
) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mut = useMutation({
    onSuccess(data) {
      toast.success("Post is succefully saved");
      navigate(`/post/${data._id}`);
    },
    onError: (err) => toast.error(err.message),
    ...opt,
    mutationFn: async (data: EditCreatePostT) => {
      const res = await createEditPost(data, (rate) => {
        setUploadProgress(rate > 90 ? 90 : rate);
      });
      setUploadProgress(130);
      await wait(300);
      queryClient.removeQueries({ queryKey: ["posts"] });
      return res;
    },
  });

  return { uploadProgress, ...mut };
};
