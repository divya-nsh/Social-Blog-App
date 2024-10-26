import { Link } from "react-router-dom";
import RenderPosts from "@/components/RenderPosts";
import { useCallback } from "react";
import { getBookmarks } from "@/Apis/apis";
import { bookmarkCtx } from "@/context/BookmarkContext";
import { useIninfityData } from "@/hooks/useInfinityData";
import { useScrollToTop } from "@/hooks/useScroll";

export default function BookmarkedPosts() {
  const bookmarkQ = useIninfityData(useCallback(getBookmarks, []));
  const setData = bookmarkQ.setData;
  const remove = useCallback(
    (id: string) => {
      setData((prev) => prev.filter((post) => post._id !== id));
    },
    [setData],
  );
  useScrollToTop();

  return (
    <bookmarkCtx.Provider value={{ remove }}>
      <div className="m-auto mt-5 max-w-2xl pb-20">
        <h2 className="border-b border-neutral-300 px-3 pb-2 font-medium text-neutral-800 dark:text-neutral-200 md:px-2 md:text-xl">
          My Bookmarks
        </h2>

        <section className="mt-4">
          <RenderPosts {...bookmarkQ} NoData={<NoBookmarks />} />
        </section>
      </div>
    </bookmarkCtx.Provider>
  );
}

function NoBookmarks() {
  return (
    <div className="pt-10 text-neutral-700">
      <div className="grid gap-4 text-center">
        <p className="text-lg font-medium dark:text-neutral-200">
          No Bookmarked 😞
        </p>
        <p className="dark:text-neutral-300">
          You can bookmark posts by clicking on bookmark button.
        </p>
        <Link
          to="/"
          className="rounded-full px-4 py-1 text-sm text-blue-600 underline-offset-4 hover:underline active:opacity-50 dark:text-blue-400"
        >
          Go to HOME
        </Link>
      </div>
    </div>
  );
}
