import { useCallback, useEffect } from "react";
import RenderPosts from "@/components/RenderPosts";
import { getPosts } from "@/Apis/posts-apis";
import { useIninfityData } from "@/hooks/useInfinityData";
import { useSearchParams } from "react-router-dom";
import { scrollFromTop } from "@/lib/utils";

export default function Home() {
  const [searchParam] = useSearchParams();
  const tag = searchParam.get("tag") || "";

  const postsQ = useIninfityData(
    useCallback((cursor) => getPosts({ cursor, tag }), [tag]),
  );

  useEffect(() => {
    scrollFromTop(0);
  }, [tag]);

  return (
    <div className="relative mx-auto mb-10 max-w-[800px]">
      {tag && (
        <h2 className="break-words border-b-4 border-b-blue-600 bg-white px-2 py-4 text-lg font-medium text-neutral-800 dark:border-b-blue-500 dark:border-t-blue-700 dark:bg-neutral-800 dark:text-white md:px-4 md:text-2xl">
          {"#" + tag}
        </h2>
      )}
      <section className="mt-5">
        <div className="mb-3 px-2 text-lg text-neutral-800 dark:text-neutral-300">
          Latest Posts
        </div>

        <RenderPosts {...postsQ} />
      </section>
    </div>
  );
}
