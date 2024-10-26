import React from "react";

export default function FetchFail({ target }: { target?: string }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center space-y-6 pt-20 text-center">
      <p className="text-3xl font-semibold text-red-600 dark:text-red-500">
        Oops! Something went wrong
      </p>
      <p className="text-lg text-gray-600 dark:text-neutral-300">
        Failed to fetch{target && ` the ${target}`}. Please try reloading the
        page or try again later.
      </p>
    </div>
  );
}
{
  /* <div className="mx-auto mt-20 flex max-w-2xl flex-col items-center space-y-6 text-center">
  <p className="text-3xl font-semibold text-red-600">
    Oops! Something went wrong
  </p>
  <p className="text-lg text-gray-600 dark:text-neutral-300">
    Failed to fetch posts, please try reloading the page or try again later.
  </p>
</div>; */
}
