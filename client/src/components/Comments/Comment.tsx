import { Link } from "react-router-dom";
import { deleteComment } from "@/Apis/apis";
import { TimeAgo } from "@/components/TimeAgo";
import { useMutation } from "@tanstack/react-query";
import LikeButton from "@/components/LikeButtonV2";
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

  const deleteWithConfirm = () => {
    setTimeout(() => {
      const confirm = window.confirm("Are you sure to delete this comment?");
      confirm && mutate(comment._id);
    }, 200);
  };

  return (
    <div
      className={twMerge(
        `border-b p-2`,
        className,
        isPending && "animate-pulse opacity-40",
      )}
    >
      <div className="flex items-center gap-2">
        <img
          loading="lazy"
          alt="User avatar"
          src={comment.author?.image?.url}
          className="size-[35px] rounded-full border object-cover"
        />
        <div className="w-full overflow-hidden">
          <Link
            to={`/profile/@${comment.author.username}`}
            className={`} flex w-full`}
          >
            <span
              className={`${comment.isCommentAuthorPostAuthor && "rounded-md bg-neutral-300 px-1 dark:bg-neutral-700"} ellipsis text-sm text-neutral-700 hover:underline dark:text-neutral-50`}
            >
              @{comment.author.username}
            </span>
          </Link>
          <TimeAgo
            timestamp={comment.createdAt}
            className="block text-sm dark:text-neutral-300"
          />
        </div>
      </div>

      <p className="mt-1 break-words px-2 text-neutral-900 dark:text-neutral-100">
        {comment.content}
      </p>

      {/*------------------- Interactions------------------- */}
      <div className="-ml-2 mt-0.5 flex items-center px-1">
        <LikeButton
          commentOrPostId={comment._id}
          target="comment"
          isUserLiked={comment.isUserLiked}
          likesCount={comment.likesCount}
          size={19}
        />

        {comment.isViewerAuthor && (
          <button
            title="Delete Comment"
            disabled={isPending}
            onClick={deleteWithConfirm}
            className="flex items-center gap-1 rounded-md px-2 text-red-500 hover:underline"
          >
            <span className="text-[0.8rem]">
              {isPending ? "Deleting..." : "DELETE"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
