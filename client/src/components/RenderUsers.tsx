import { Link, useNavigate } from "react-router-dom";
import { User } from "@/types/indext";
import InfiniteScroll from "react-infinite-scroll-component";
import { PLACEHOLDER_USER_IMG } from "@/lib/utils";
import { ReactNode } from "react";
import { InfinityDataReturn } from "@/hooks/useInfinityData";
import FetchFail from "./FetchFail";

type Props = {
  NoData?: ReactNode;
} & InfinityDataReturn<User>;

export default function RenderUsers({
  data = [],
  fetchNextPage,
  isPending,
  hasNextPage,
  isNextPageError,
  error,
}: Props) {
  const navigate = useNavigate();
  const navigateToProfile = (username: string) => {
    return () => navigate(`/profile/${username}`);
  };
  const isNoData = data.length <= 0 && !isPending;

  if (isPending) {
    return (
      <div className="mt-3 animate-pulse text-center text-neutral-800 dark:text-neutral-200">
        Loading Data...
      </div>
    );
  }

  if (!isNextPageError && error) {
    return <FetchFail target="users" />;
  }

  if (isNoData) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-3 px-3 py-5">
        <p className="text-xl font-bold text-neutral-900 dark:text-neutral-300">
          No Results found
        </p>
        <p className="text-gray-700 dark:text-neutral-300">
          Try searching for something else
        </p>
      </div>
    );
  }

  return (
    <InfiniteScroll
      hasMore={hasNextPage}
      next={fetchNextPage}
      dataLength={data.length}
      loader={
        <div className="mt-3 animate-pulse text-center text-neutral-800 dark:text-neutral-300">
          Loading more...
        </div>
      }
    >
      <div className="grid gap-3">
        {data.map((user) => {
          return (
            <div
              key={user._id}
              className="flex cursor-pointer items-center gap-3 overflow-auto rounded-md bg-white px-2 py-2 dark:bg-neutral-800 sm:gap-4 sm:px-5"
              onClick={navigateToProfile(user.username)}
            >
              <img
                alt={`${user.username} profile pic`}
                src={user?.image.url || PLACEHOLDER_USER_IMG}
                className="h-[60px] w-[60px] shrink-0 rounded-full border object-cover group-hover:text-blue-500"
              />
              <Link
                to={`/profile/${user.username}`}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 overflow-auto"
              >
                <p className="break-words text-lg font-bold text-neutral-800 underline-offset-1 hover:underline dark:text-neutral-100 sm:text-xl">
                  {user.fullName}
                </p>
                <p className="block cursor-pointer break-words text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  @{user.username}
                </p>
              </Link>
            </div>
          );
        })}
      </div>
    </InfiniteScroll>
  );
}
