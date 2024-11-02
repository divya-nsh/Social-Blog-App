import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import LikeButton from "@/components/LikeButtonV2";
import { Skeleton } from "@/components/Skeleton";
import { NotFoundPage } from "./NotFound";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deletePost, getPost, getPostBySlug } from "@/Apis/posts-apis";
import { IPost } from "@/types/indext";
import { AxiosError } from "axios";
import { CommentSec } from "@/components/Comments/CommentSec";
import BookmarkButton from "@/components/BookmarkButton";
import { ChatDots, Link as LinkIcon } from "@phosphor-icons/react";
import DOMPurify from "dompurify";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useScrollToTop } from "@/hooks/useScroll";
import FetchFail from "@/components/FetchFail";
import Button from "@/components/ButtonV2";

export default function PostPage() {
  const navigate = useNavigate();
  const { postId } = useParams();
  if (!postId) throw new Error("postId params is not specify in url");
  const [commentsCount, setCommCount] = useState(0);

  const {
    isPending,
    data: post,
    error,
  } = useQuery<IPost, AxiosError<{ error: string }>>({
    queryFn: () => {
      return postId.includes("-") ? getPostBySlug(postId) : getPost(postId);
    },
    queryKey: ["posts", postId],
  });

  useEffect(() => {
    if (post) setCommCount(post.commentsCount);
  }, [post, navigate]);

  useScrollToTop();

  if (error) {
    if (error?.response?.status === 404) return <NotFoundPage />;
    return <FetchFail target="posts" />;
  }

  if (isPending) {
    return <Skeleton contentSize={300} maxWidth="48rem" mt={5} />;
  }

  return (
    <main className="mx-auto mb-6 mt-3 max-w-3xl rounded-lg bg-white pb-3 shadow-sm dark:bg-neutral-800">
      {/* Author Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-2 py-2 sm:px-4">
        <Link
          to={`/profile/${post.author.username}`}
          className="block overflow-hidden"
        >
          <div className="flex w-full cursor-pointer items-center gap-3 sm:gap-4">
            <img
              alt="Author avatar"
              src={post.author.image.url}
              className="size-10 flex-shrink-0 rounded-full border object-cover"
            />
            <div className="text-md overflow-hidden text-neutral-700 dark:text-neutral-100">
              <p className="ellipsis font-bold tracking-wider hover:underline">
                {post.author.fullName}
              </p>
              <p className="ellipsis text-[12px] tracking-wider opacity-90 hover:underline">
                @{post.author.username}
              </p>
            </div>
          </div>
        </Link>
        {post.isViewerAuthor && <EditDeletePost postId={post._id} />}
      </div>

      <div className="flex cursor-default justify-between gap-2 px-2 text-gray-500 sm:px-4">
        <small
          title={format(new Date(), "PPPP 'at' pp")}
          className="dark:text-neutral-200"
        >
          Published: {format(new Date(post.createdAt), "d MMM yyyy")}
        </small>
        {new Date(post.updatedAt) > new Date(post.createdAt) && (
          <small
            title={format(new Date(), "PPPP 'at' pp")}
            className="dark:text-neutral-200"
          >
            Edited: {format(new Date(post.createdAt), "d MMM yyyy")}
          </small>
        )}
      </div>

      <h2 className="mb-0 mt-3 break-words px-4 text-start text-3xl font-bold text-neutral-800 dark:text-white">
        {post.title}
      </h2>

      {/* Tags redering */}
      {!!post.tags.length && (
        <div className="mt-3 flex flex-wrap gap-2 px-4 text-neutral-800">
          {post?.tags.map((tag, i) => (
            <Link
              key={i}
              className="word-wrap rounded-full bg-slate-100 px-3 py-1 text-sm hover:text-blue-600 hover:underline dark:bg-neutral-700 dark:text-neutral-100 dark:hover:text-blue-600"
              to={`/?tag=${tag}`}
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      <div className="px-2 sm:px-4">
        <img
          alt="Post CoverImage"
          hidden={!post?.coverImgUrl}
          src={post.coverImgUrl}
          style={{
            aspectRatio: "16/9",
          }}
          className="mt-5 w-full rounded-md object-cover"
          loading="eager"
        />
      </div>

      <div className="ql-snow mt-3 px-6 dark:text-neutral-100">
        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(post?.content || ""),
          }}
          className="ql-editor h-fit min-h-fit pb-1 pl-0"
        ></div>
      </div>

      {/* Interactions */}
      <section className="-ml-2 flex flex-wrap px-2 pb-2 pt-5 sm:px-4">
        <LikeButton
          commentOrPostId={postId}
          target="post"
          isUserLiked={post.isUserLiked}
          likesCount={post.likesCount}
        />

        <BookmarkButton
          className="active:scale-95"
          size={23}
          postId={postId}
          defaultState={post.isBookmarked}
        />

        <button
          onClick={() => {
            const link = window.location.href;
            navigator.clipboard
              .writeText(link)
              .then(() => {
                alert("Link copied to clipboard!");
              })
              .catch((err) => {
                console.error("Failed to copy: ", err);
              });
          }}
          title="Copy Post URL"
          className="flex items-center justify-center gap-1 rounded-full px-3 py-1 text-neutral-900 transition-all duration-300 hover:bg-slate-100 dark:text-neutral-100 dark:hover:bg-neutral-900"
        >
          <LinkIcon size={23} />
        </button>

        <div className="ml-auto flex items-center gap-1 rounded-full border bg-slate-100 px-2 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-200">
          <ChatDots size={25} />
          <span>{commentsCount}</span>
        </div>
      </section>

      {/* Comment section */}
      <CommentSec postId={post._id} setCount={setCommCount} />
    </main>
  );
}

function EditDeletePost({ postId }: { postId: string }) {
  const navigate = useNavigate();

  const { isPending, mutate } = useMutation({
    mutationFn: deletePost,
    onSuccess() {
      toast.success("Post deleted successfully");
      navigate("/");
    },
    onError() {
      toast.error("Failed to delete post");
    },
  });

  return (
    <div className="relative flex flex-shrink-0 flex-wrap gap-2">
      {isPending ? (
        <span className="animate-pulse text-sm text-neutral-500">
          Deleting...
        </span>
      ) : (
        <>
          <Link
            to={`/post/${postId}/edit`}
            className="flex items-center rounded-md bg-blue-600 px-3 py-1 text-sm text-white"
          >
            Edit
          </Link>
          <Button
            variants="danger"
            className="px-3 py-1 text-sm"
            onClick={() => {
              const isConfirm = confirm("Are you sure to delete this post ?");
              isConfirm && mutate(postId);
            }}
          >
            Delete
          </Button>
        </>
      )}
    </div>
  );
}
