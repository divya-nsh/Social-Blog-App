import format from "date-fns/format";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { twMerge } from "tailwind-merge";

// import { formatDistanceToNow, format } from "date-fns";

export const TimeAgo = ({
  timestamp,
  className = "",
}: {
  timestamp: string | number;
  className?: string;
}) => {
  const timeAgo =
    formatDistanceToNow(new Date(timestamp)).replace(/about|less than/g, "") +
    " ago";

  return (
    <time
      dateTime={new Date(timestamp).toISOString()}
      title={format(new Date(), "PPPP 'at' pp")}
      className={twMerge(
        "inline-block cursor-default text-[0.75rem] text-neutral-600 dark:text-neutral-200",
        className,
      )}
    >
      {timeAgo}
    </time>
  );
};
