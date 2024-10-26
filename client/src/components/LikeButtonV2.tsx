import { useState } from "react";
import { Heart } from "@phosphor-icons/react";
import useRequireLogin from "@/hooks/useRequireLogin";
import { twMerge } from "tailwind-merge";
import { likeDislikeApi } from "@/Apis/apis";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

interface LikeButtonProps {
  commentOrPostId: string;
  className?: string;
  likesCount?: number;
  isUserLiked?: boolean;
  size?: number;
  target: "comment" | "post";
}

export default function LikeButton({
  commentOrPostId,
  className,
  likesCount = 0,
  isUserLiked = false,
  target,
  size = 22,
}: LikeButtonProps) {
  const { redirectIfNotLogin } = useRequireLogin();
  const [isLiked, setLiked] = useState(isUserLiked);
  const [count, setCount] = useState(likesCount);

  const { mutate } = useMutation({
    onMutate(arg) {
      setLiked(arg);
      setCount(arg ? count + 1 : count - 1);
      return { count, isLiked };
    },
    mutationFn: (isLike: boolean) => {
      return likeDislikeApi(
        target,
        commentOrPostId,
        isLike ? "like" : "dislike",
      );
    },
    onError(e, v, ctx) {
      toast.error(`Failed to like ${target}`);
      if (ctx) {
        setCount(ctx.count);
        setLiked(ctx.isLiked);
      }
    },
  });

  const handleClick = async () => {
    if (!redirectIfNotLogin()) return;
    mutate(!isLiked);
  };

  return (
    <button
      title={`${!isLiked ? "Like" : "Unlike"}`}
      onClick={handleClick}
      className={twMerge(
        "flex items-center justify-center gap-1 rounded-full px-3 py-1 text-neutral-900 transition-all duration-200 hover:bg-slate-100 active:scale-95 dark:text-neutral-100 dark:hover:bg-neutral-900",
        className,
      )}
    >
      <Heart
        className="flex-shrink-0"
        size={size}
        fill="#FF7377"
        weight={isLiked ? "fill" : "regular"}
      />

      <span className="text-[0.8rem] font-medium text-neutral-600 dark:text-neutral-100">
        {count || ""}
      </span>
    </button>
  );
}
