/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "../types/indext";

type Options = {
  enabled?: boolean;
};

type InifiniteQStatus =
  | "error"
  | "idle"
  | "pending"
  | "nextPageError"
  | "success"
  | "fechingNext";

export function useIninfityData<T>(
  fn: (
    nextPageCursor?: string | null,
  ) => Promise<{ nextPageCursor: string | null; results: Array<T> }>,
  { enabled = true }: Options = {},
) {
  const [data, setData] = useState<T[]>([]);
  const nextPageCursor = useRef<string | null>(null);
  const [status, setStatus] = useState<InifiniteQStatus>("pending");
  const [error, setError] = useState<ApiError | null>(null);
  const isFetching = status === "pending" || status === "fechingNext";

  const fetchNextPage = useCallback(async () => {
    if (isFetching || !nextPageCursor.current) return;
    setStatus("fechingNext");
    await fn(nextPageCursor.current)
      .then((data) => {
        setData((prev) => [...prev, ...data.results]);
        nextPageCursor.current = data.nextPageCursor;
        setStatus("idle");
      })
      .catch((err) => {
        setStatus("nextPageError");
        setError(err);
      });
  }, [fn, isFetching]);

  const intialFetch = useCallback(
    async (signal?: AbortSignal) => {
      setData([]);
      setStatus("pending");
      fn()
        .then((data) => {
          if (signal?.aborted) return;
          setData(data.results);
          nextPageCursor.current = data.nextPageCursor;
          setStatus("idle");
        })
        .catch((err) => {
          if (signal?.aborted) return;
          setStatus("error");
          setError(err);
        });
    },
    [fn],
  );

  useEffect(() => {
    if (!enabled) return;
    const abortController = new AbortController();
    intialFetch(abortController.signal);
    return () => {
      abortController.abort();
    };
  }, [intialFetch, enabled]);

  return {
    data,
    status,
    isPending: status === "pending",
    isFetching: status === "pending" || status === "fechingNext",
    error,
    fetchNextPage,
    hasNextPage: !!nextPageCursor.current,
    cursor: nextPageCursor.current,
    setData,
    isFetchingNext: status === "fechingNext",
    isNextPageError: status === "nextPageError",
    isError: status === "error" || status === "nextPageError",
    reset: intialFetch,
  };
}

export type InfinityDataReturn<T> = ReturnType<typeof useIninfityData<T>>;
