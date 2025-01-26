import { useCallback } from "react";
import CommentForm from "./CommentForm";
import { useUserContext } from "@/hooks/useUserCtx";
import { getComments } from "@/Apis/apis";
import { DotsThree } from "@phosphor-icons/react";
import { CommentSimple } from "./Comment";
import { useIninfityData } from "@/hooks/useInfinityData";
import { PLACEHOLDER_USER_IMG } from "@/lib/utils";

interface CommentSecProps {
  postId: string;
  commentsCount: number;
  setCount?: React.Dispatch<React.SetStateAction<number>>;
}

export const CommentSec = ({
  postId,
  setCount,
  commentsCount,
}: CommentSecProps) => {
  const { user } = useUserContext();
  const {
    data: comments,
    isPending,
    error,
    setData,
    fetchNextPage,
    hasNextPage,
  } = useIninfityData(
    useCallback((cursor) => getComments({ postId, cursor }), [postId]),
  );

  return (
    <section className="mx-auto pb-3 pt-2" id="comments">
      <h3 className="mb-1 px-2 text-2xl font-medium text-neutral-800 dark:text-neutral-200">
        {commentsCount} Comments
      </h3>
      <CommentForm
        setComments={setData}
        avatarUrl={user?.image.url || PLACEHOLDER_USER_IMG}
        postId={postId}
        onSuccess={() => setCount && setCount((p) => p + 1)}
      />

      {/* Rendering comments */}
      <div className="mb-4 mt-2 px-2">
        {comments.map((comm) => {
          return (
            <CommentSimple
              setComments={setData}
              key={comm._id}
              comment={comm}
              onRemoved={() => setCount && setCount((p) => p - 1)}
            />
          );
        })}
      </div>

      {/* Error and loading state */}
      <div>
        {error && (
          <p className="border border-red-600 bg-red-100 py-1 text-center text-lg text-red-600">
            Error: {error.message}
          </p>
        )}
        {isPending && (
          <div className="mt-2 flex items-center justify-center">
            <DotsThree
              size={50}
              color="black"
              className="mt-2 animate-bounce dark:text-neutral-300"
            />
          </div>
        )}
        {!isPending && hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            className="mx-auto block w-full px-2 py-2 text-indigo-700 underline active:opacity-60"
          >
            Load more
          </button>
        )}
      </div>
    </section>
  );
};
