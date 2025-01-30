import { useCallback } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import RenderPosts from "@/components/RenderPosts";
import { useQuery } from "@tanstack/react-query";
import { getUserByUsername } from "@/Apis/userApis";
import { getPosts } from "@/Apis/posts-apis";
import { useIninfityData } from "@/hooks/useInfinityData";
import { NotFoundPage } from "./NotFound";
import { ApiError } from "@/types/indext";
import { SocialLinks } from "@/components/SocialLinks";
import { Calendar, SpinnerGap } from "@phosphor-icons/react";
import { ImageModal } from "@/components/ImageModel";
import { useScrollToTop } from "@/hooks/useScroll";
import FetchFail from "@/components/FetchFail";

export function Profile() {
  const { username } = useParams();
  if (!username) throw "";
  return <InnerProfile username={username} key={username} />;
}

function InnerProfile({ username }: { username: string }) {
  const userQ = useQuery({
    queryKey: ["user", username],
    queryFn: () => getUserByUsername(username),
  });

  const postsQ = useGetUserPosts(userQ.data?._id || "", {
    enabled: !!userQ.data?.total_posts,
  });

  useScrollToTop();

  if (userQ.isPending) {
    return (
      <div className="absolute bottom-0 left-0 right-0 top-0 grid place-items-center">
        <SpinnerGap size={100} color="blue" className="animate-spin" />
      </div>
    );
  }

  if (userQ.error) {
    const e = userQ.error as ApiError;
    if (e?.response?.status === 404) return <NotFoundPage />;
    return <FetchFail target="profile" />;
  }

  const user = userQ.data;

  return (
    <main className="mx-auto max-w-3xl animate-fadeIn">
      {/* User Profile */}
      <section className="mx-auto max-w-3xl border border-t-0 bg-white dark:border-none dark:bg-neutral-800 md:rounded-b-xl">
        <div className="flex flex-wrap items-center gap-4 px-3 py-4 sm:gap-5 sm:px-4">
          <ImageModal>
            {({ open }) => (
              <button
                onClick={() => {
                  open(user.image?.url);
                }}
                className="flex-shrink-0 transition-all duration-300 active:scale-90"
              >
                <img
                  alt="User Profile Image"
                  src={user.image?.url}
                  className="size-[100px] rounded-full border object-cover md:size-[120px]"
                />
              </button>
            )}
          </ImageModal>
          {user.isViewerProfile && (
            <Link
              className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white transition-all duration-300 hover:underline active:scale-90 sm:hidden md:py-1.5"
              to="/account-settings"
            >
              Edit profile
            </Link>
          )}
          <div className="w-full space-y-0.5 sm:w-max sm:flex-1">
            <h2 className="overflow-hidden break-words text-xl font-bold text-neutral-800 dark:text-neutral-100 md:text-2xl">
              {user?.fullName || "Full Name"}
            </h2>
            <p className="w-full break-words font-medium text-neutral-950 dark:text-neutral-200">
              {"@" + user.username}
            </p>
            <p className="flex items-center gap-2 text-sm text-neutral-950 dark:text-neutral-200">
              {user.total_posts} posts
            </p>
            <p className="flex items-center gap-2 text-sm text-neutral-950 dark:text-neutral-200">
              Joined on july 5
              <Calendar size={19} color="gray" weight="fill" />
            </p>
          </div>

          {user.isViewerProfile && (
            <Link
              className="hidden items-center gap-1 self-start rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white transition-all duration-300 hover:underline active:scale-90 sm:flex md:py-1.5"
              to="/account-settings"
            >
              Edit profile
            </Link>
          )}
        </div>

        <div className="px-3 pb-1 sm:px-6">
          {user.bio && (
            <p className="break-words pb-2 text-neutral-900 dark:text-neutral-200">
              {user.bio}
            </p>
          )}

          <SocialLinks
            links={(user.socialLinks as Record<string, string>) || {}}
            className="-ml-2"
          />
        </div>
        {/* <div className="flex gap-10 rounded-b-xl border-t px-2 text-[0.9rem] text-red-400 dark:border-neutral-700 sm:px-4">
          <span
            className={`py-2 pl-2 font-medium text-gray-600 dark:text-neutral-300`}
          >
            Posts
          </span>
        </div> */}
      </section>

      {/*User Posts*/}
      <section className="mt-5 pb-10">
        <RenderPosts
          NoData={""}
          {...postsQ}
          isPending={!!userQ.data.total_posts && postsQ.isPending}
        />
      </section>
    </main>
  );
}

function useGetUserPosts(userId: string, opt: { enabled: boolean }) {
  return useIninfityData(
    useCallback((cursor) => getPosts({ cursor, user: userId }), [userId]),
    opt,
  );
}
