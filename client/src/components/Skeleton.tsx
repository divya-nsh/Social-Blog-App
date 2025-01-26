export function Skeleton({ mt = 10, contentSize = 50, maxWidth = "100%" }) {
  return (
    <div
      style={{
        maxWidth: maxWidth,
      }}
      className={`mx-auto w-full border border-gray-300 bg-neutral-50 px-3 sm:rounded-xl mt-${mt} py-2 opacity-50 dark:bg-neutral-800`}
    >
      <div className="my-3 flex h-8 animate-pulse items-center gap-1 rounded-xl bg-neutral-300 px-4 py-1 dark:bg-neutral-600"></div>

      <div className="my-3 h-6 animate-pulse rounded-xl bg-neutral-300 py-2 dark:bg-neutral-600"></div>

      <div
        className={`mt-3 animate-pulse rounded-xl bg-neutral-300 dark:bg-neutral-600`}
        style={{ height: `${contentSize}px` }}
      ></div>

      <div className="my-3 h-6 animate-pulse rounded-xl bg-neutral-300 py-2 dark:bg-neutral-600"></div>
    </div>
  );
}
