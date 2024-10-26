import { Trash } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { deleteComment } from "@/Apis/apis";
import { TimeAgo } from "../TimeAgo";
import { useMutation } from "@tanstack/react-query";
import LikeButton from "../LikeButtonV2";
import { IComment } from "@/types/indext";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";

interface CommentProp {
  comment: IComment;
  setComments: React.Dispatch<React.SetStateAction<IComment[]>>;
  className?: string;
  onRemoved?: (docId: string) => void;
}

export function CommentSimple({
  comment,
  className,
  setComments,
  onRemoved,
}: CommentProp) {
  const { mutate, isPending } = useMutation({
    mutationFn: deleteComment,
    onSuccess: (_, id) => {
      setComments((p) => p.filter((e) => e._id !== id));
      onRemoved && onRemoved(id);
    },
    onError: () => toast.error("Failed to delete comment try again"),
  });

  return (
    <div
      className={twMerge(
        ` relative rounded-2xl px-1 py-3 pb-2 sm:px-2`,
        className,
        isPending && "animate-pulse opacity-40",
      )}
    >
      <img
        width={50}
        height={50}
        alt="User avatar"
        src={comment.author?.image?.url}
        className="size-10 rounded-full border object-cover"
      />

      <div className="w-full flex-1">
        <div>
          <Link
            to={`/profile/@${comment.author.username}`}
            className="flex flex-wrap"
          >
            <h2 className={`flex flex-wrap items-center`}>
              {comment.isCommentAuthorPostAuthor && (
                <span className="text-sm">✨</span>
              )}
              <span
                className={`px-1 text-sm text-blue-700 hover:underline dark:text-neutral-50`}
              >
                @{comment.author.username}
              </span>
            </h2>
            <TimeAgo
              timestamp={comment.createdAt}
              className="ml-1 dark:text-neutral-300"
            />
          </Link>
        </div>

        <p className="ml-1 mt-0.5 break-words text-[0.9rem] text-neutral-900 dark:text-neutral-100">
          {comment.content}
        </p>

        {/*------------------- Interactions------------------- */}
        <div className="-ml-2 mt-1 flex w-full items-center">
          <LikeButton
            commentOrPostId={comment._id}
            target="comment"
            isUserLiked={comment.isUserLiked}
            likesCount={comment.likesCount}
          />
        </div>
      </div>

      {comment.isViewerAuthor && (
        <button
          title="Delete Comment"
          disabled={isPending}
          onClick={() => {
            setTimeout(() => {
              const confirm = window.confirm(
                "Are you sure to delete this comment?",
              );
              confirm && mutate(comment._id);
            }, 200);
          }}
          className="absolute right-2 top-2 flex-col items-end"
        >
          <Trash
            size={36}
            className="block rounded-full px-2 py-1 text-red-600 transition-all duration-200 hover:bg-gray-100 hover:underline hover:shadow-sm active:scale-90 dark:text-red-500 dark:hover:bg-neutral-900"
          />
        </button>
      )}
    </div>
  );
}
