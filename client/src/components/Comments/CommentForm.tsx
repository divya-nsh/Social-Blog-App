import React, { FormEvent, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { PaperPlaneRight, Spinner } from "@phosphor-icons/react";
import { createComment } from "@/Apis/apis";
import { useMutation } from "@tanstack/react-query";
import useRequireLogin from "@/hooks/useRequireLogin";
import { IComment } from "@/types/indext";
import toast from "react-hot-toast";

interface CommentFormAttr {
  avatarUrl?: string;
  className?: string;
  postId: string;
  disabled?: boolean;
  onSuccess?: () => void;
  setComments: React.Dispatch<React.SetStateAction<IComment[]>>;
}

export default function CommentForm({
  avatarUrl,
  postId,
  disabled,
  setComments,
  onSuccess,
}: CommentFormAttr) {
  const [content, setContent] = useState("");
  const { redirectIfNotLogin } = useRequireLogin();

  const { mutate, isPending } = useMutation({
    mutationFn: createComment,
    onSuccess: (comm) => {
      setComments((p) => [comm, ...p]);
      onSuccess && onSuccess();
      setContent("");
    },
    onError: () => {
      toast.error("Failed to Comment");
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!redirectIfNotLogin()) return;
    if (!content) return;
    mutate({ postId, content: content });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={
          "relative flex w-full items-center border-b border-t bg-neutral-200 px-2 py-2 dark:bg-neutral-700"
        }
      >
        {avatarUrl && (
          <img
            alt="User avatar"
            src={avatarUrl}
            width={40}
            height={40}
            className="size-10 rounded-full border object-cover"
          />
        )}

        {/* Input box */}
        <div className="mx-2 flex w-full flex-wrap items-center rounded-xl bg-white px-3 py-2 ring-blue-300 focus-within:ring-1 dark:bg-neutral-800 dark:ring-neutral-300">
          <TextareaAutosize
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isPending || disabled}
            placeholder="Type your comment..."
            maxRows={5}
            required
            className="w-full bg-transparent text-sm outline-none dark:text-neutral-100 sm:text-base"
          />
        </div>

        <button
          title="Add A Comment"
          className="flex items-center rounded-full bg-transparent text-gray-700 transition-all duration-300 enabled:hover:opacity-90 enabled:active:scale-90 disabled:opacity-50 dark:text-neutral-300"
          type="submit"
          disabled={!content || isPending || disabled}
        >
          {isPending ? (
            <Spinner size={30} color="black" className={`animate-spin`} />
          ) : (
            <PaperPlaneRight className={`size-7 sm:size-9`} />
          )}
        </button>
      </form>
    </>
  );
}
