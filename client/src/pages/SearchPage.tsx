import { startTransition, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import RenderPosts from "@/components/RenderPosts";
import { scrollFromTop } from "@/lib/utils";
import { searchPosts } from "@/Apis/posts-apis";
import { searchUser } from "@/Apis/userApis";
import RenderUsers from "@/components/RenderUsers";
import { useIninfityData } from "@/hooks/useInfinityData";
import { twMerge } from "tailwind-merge";
import { useScrollToTop } from "@/hooks/useScroll";

const tabs = [
  { label: "Posts", path: "posts" },
  { label: "People", path: "people" },
];

export default function SearchPage() {
  const [param, setParam] = useSearchParams();
  const activeTab = param.get("type") || "posts";
  const query = param.get("q") || "";
  const searchPostsQ = useSearchPosts(query || "");
  const searchUserQ = useSearchUsersQ(query || "");

  const changeTab = (type: string) => () => {
    startTransition(() => {
      setParam({ q: query || "", type });
    });
    scrollFromTop(0);
  };

  if (!["posts", "people"].includes(activeTab)) {
    changeTab("posts")();
  }
  useScrollToTop();

  return (
    <div className="mx-auto max-w-3xl animate-fadeIn pb-10">
      <section className="w-full overflow-hidden border bg-white pt-2 dark:border-none dark:bg-neutral-800 md:rounded-b-lg">
        <h2 className="mb-2 px-3 py-4 text-xl dark:bg-neutral-800 sm:px-5 md:text-2xl">
          <span className="dark:text-neutral-100">Results for </span>
          <strong className="ml-1 break-words dark:text-neutral-100">
            {query}
          </strong>
        </h2>
        <div className="flex gap-5">
          {tabs.map((v) => (
            <button
              key={v.path}
              onClick={changeTab(v.path)}
              className={twMerge(
                "border-b-2 border-transparent px-5 pb-2 font-medium text-neutral-800 hover:text-black dark:border-transparent dark:text-neutral-100",
                v.path === activeTab
                  ? "border-neutral-900 opacity-100 dark:border-neutral-300"
                  : "opacity-80",
              )}
            >
              {v.label}
            </button>
          ))}
        </div>
      </section>

      {activeTab === "posts" && (
        <section className="mt-6">
          <RenderPosts {...searchPostsQ} />
        </section>
      )}

      {activeTab === "people" && (
        <section className="mt-6">
          <RenderUsers
            {...searchUserQ}
            error={searchUserQ.error}
            data={searchUserQ.data || []}
          />
        </section>
      )}
    </div>
  );
}

function useSearchPosts(query: string) {
  return useIninfityData(
    useCallback((cursor) => searchPosts({ text: query, cursor }), [query]),
  );
}

function useSearchUsersQ(query: string) {
  return useIninfityData(
    useCallback((cursor) => searchUser(query, cursor), [query]),
  );
}
