import { ChatDots } from "@phosphor-icons/react";
import { Link, useNavigate } from "react-router-dom";
import LikeButton from "./LikeButtonV2";
import { TimeAgo } from "@/components/TimeAgo";
import BookmarkButton from "@/components/BookmarkButton";
import { IPost } from "@/types/indext";
import { twMerge } from "tailwind-merge";

const defaultImg =
  "https://i0.wp.com/vssmn.org/wp-content/uploads/2018/12/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png?fit=860%2C681&ssl=1";

export function Postv2({
  _id,
  title,
  author,
  createdAt,
  isUserLiked,
  likesCount,
  tags,
  coverImgUrl,
  isBookmarked,
  commentsCount,
  className,
  slug,
}: IPost & {
  className?: string;
}) {
  const navigate = useNavigate();
  const navigateToPost = () => navigate(`/post/${slug || _id}`);
  const navigateToProfile = () => navigate(`/profile/${author.username}`);

  return (
    <article
      className={twMerge(
        "flex w-full flex-col justify-between gap-4 border bg-white px-4 py-4 dark:border-0 dark:bg-neutral-800 sm:flex-row sm:items-center sm:gap-3 lg:rounded-lg",
        className,
      )}
    >
      <div className="w-full self-start overflow-hidden">
        {/* -----------Author Info---------------- */}
        <div className="flex items-center gap-2">
          <img
            alt="User Avatar"
            onClick={navigateToProfile}
            src={author.image.url || defaultImg}
            className="size-9 cursor-pointer rounded-full border object-cover"
          />
          <div className="grid">
            <Link
              to={`/profile/${author.username}`}
              className="ellipsis text-sm tracking-wide hover:underline dark:text-white"
            >
              {author.fullName}
            </Link>
            <TimeAgo timestamp={createdAt} />
          </div>
        </div>

        {/* Post Content */}
        <div className="mt-2 w-full">
          <Link
            to={`/post/${_id}`}
            className={`md:text- line-clamp-3 w-full text-xl font-bold text-neutral-900 hover:text-blue-600 hover:underline dark:text-neutral-100 sm:line-clamp-2`}
          >
            <h2 className="break-words">{title}</h2>
          </Link>

          {!!tags?.length && (
            <ul className="mt-1 flex flex-wrap gap-2.5">
              {tags?.map((tag, i) => (
                <li key={i}>
                  <Link
                    to={`/?tag=${tag}`}
                    className="rounded-lg text-sm text-neutral-800 hover:text-blue-600 hover:underline dark:text-neutral-50 dark:hover:text-blue-600"
                  >
                    #{tag}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {/* User Interactions */}

          <div className="-ml-2 mt-2.5 flex w-full gap-1">
            <LikeButton
              commentOrPostId={_id}
              target="post"
              likesCount={likesCount}
              isUserLiked={isUserLiked}
              size={22}
              className="rounded-full px-3 py-1"
            />

            <div className="flex items-center justify-center gap-1 rounded-full px-3 py-1 text-neutral-900 transition-all duration-300 hover:bg-slate-100 dark:text-neutral-100 dark:hover:bg-neutral-900">
              <ChatDots size={22} />
              {commentsCount && <span>{commentsCount}</span>}
            </div>

            <BookmarkButton
              className="flex items-center justify-center gap-1 rounded-full px-3 py-1 text-neutral-900 transition-all duration-300 hover:bg-slate-100 dark:text-neutral-100 dark:hover:bg-neutral-900"
              size={22}
              postId={_id}
              defaultState={isBookmarked}
            />
          </div>
        </div>
      </div>

      {coverImgUrl && (
        <div className="flex-shrink-0 sm:w-[250px]">
          <img
            alt="Post Thumbnail"
            onClick={navigateToPost}
            src={coverImgUrl}
            style={{
              aspectRatio: "16/9",
            }}
            className="w-full rounded-md object-cover"
            loading="lazy"
          />
        </div>
      )}
    </article>
  );
}
