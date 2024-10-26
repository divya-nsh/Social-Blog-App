/* eslint-disable @typescript-eslint/no-unused-vars */
import { Skeleton } from "./Skeleton";
import { BookmarkedPost, IPost } from "@/types/indext";
import InfiniteScroll from "react-infinite-scroll-component";
import { ReactNode } from "react";
import { Postv2 } from "./PostV2";
import { InfinityDataReturn } from "@/hooks/useInfinityData";
import FetchFail from "./FetchFail";

type Prop = {
  NoData?: ReactNode;
} & Pick<
  InfinityDataReturn<IPost | BookmarkedPost>,
  | "data"
  | "fetchNextPage"
  | "isPending"
  | "hasNextPage"
  | "error"
  | "isNextPageError"
>;

export default function RenderPosts({
  data,
  fetchNextPage,
  isPending,
  hasNextPage,
  error,
  isNextPageError,
  NoData = (
    <div className="flex w-full flex-col items-center justify-center gap-3 px-3 py-5">
      <p className="text-xl font-bold text-neutral-700 dark:text-neutral-300">
        No Results found
      </p>
      <p className="dark:text-neutral-300">Try searching for something else</p>
    </div>
  ),
}: Prop) {
  if (isPending) {
    return (
      <div className="flex w-full flex-col gap-4">
        {[1, 2, 3].map((v) => (
          <Skeleton key={v} mt={0} />
        ))}
      </div>
    );
  }

  if (!isNextPageError && error) {
    return <FetchFail target="posts" />;
  }

  if (data.length <= 0 && !isPending) {
    return NoData;
  }

  return (
    <div className="w-full">
      <InfiniteScroll
        dataLength={data.length}
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={
          <div className="mt-6 grid gap-6">
            <Skeleton mt={0} />
            <Skeleton mt={0} />
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          {data.map((post) => (
            <Postv2 key={post._id} {...post} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}
