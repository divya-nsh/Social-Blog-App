/* eslint-disable @typescript-eslint/no-unused-vars */
import { BookmarkSimple } from "@phosphor-icons/react";
import { ButtonHTMLAttributes, useState } from "react";
import { twMerge } from "tailwind-merge";
import { addRemoveBookmark } from "../Apis/apis";
import toast from "react-hot-toast";
import { useBookmarkCtx } from "../context/BookmarkContext";
import useRequireLogin from "@/hooks/useRequireLogin";

export interface BookmarkButtonAttr
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  defaultState?: boolean;
  postId: string;
  size?: number;
}

export default function BookmarkButton({
  defaultState = false,
  postId,
  size = 30,
  className,
  ...rest
}: BookmarkButtonAttr) {
  const [isMark, setMark] = useState(defaultState);
  const { redirectIfNotLogin } = useRequireLogin();
  const { remove } = useBookmarkCtx();

  const toggleMark = async () => {
    if (!redirectIfNotLogin()) return;
    setMark((p) => !p);
    try {
      await addRemoveBookmark(postId, !isMark);

      if (isMark) {
        toast.success("Post removed from Bookmarks", {
          position: "bottom-center",
          style: {
            backgroundColor: "green",
            color: "white",
            fontSize: "0.9rem",
          },
        });
      } else {
        toast.success("Post added to your Bookmarked", {
          position: "bottom-center",
          style: {
            backgroundColor: "green",
            color: "white",
            fontSize: "0.9rem",
          },
        });
      }
      remove(postId);
    } catch (error) {
      toast.error(`Failed to ${isMark ? "remove Bookmark" : "bookmark"}`);
      setMark(isMark);
    }
  };

  return (
    <button
      title={isMark ? "Unbookmark post" : "Bookmark post"}
      onClick={toggleMark}
      className={twMerge(
        "flex items-center justify-center gap-1 rounded-full px-3 py-1 text-neutral-900 transition-all duration-300 hover:bg-slate-100 dark:text-neutral-100 dark:hover:bg-neutral-900",
        className,
      )}
      type="button"
      {...rest}
    >
      {isMark ? (
        <BookmarkSimple size={size} color="#7d7979" weight="fill" />
      ) : (
        <BookmarkSimple size={size} />
      )}
    </button>
  );
}
