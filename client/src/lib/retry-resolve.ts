function wait(delay = 0) {
  return new Promise((res) => setTimeout(res, delay));
}
//Retries value can either be number or a Retry handler funtion which decide when to retry.
type RetryResolveOptions = {
  retries?: number | ((retryLeft: number, err: unknown) => boolean);
  delay?: number;
  backoffFactor?: number;
  initialDelay?: number;
  maxBackOff?: number;
};

export async function resolveWithRetries<R>(
  fn: () => Promise<R>,
  {
    retries = 3,
    delay = 1000,
    backoffFactor = 2,
    initialDelay = 0,
    maxBackOff = Infinity,
  }: RetryResolveOptions = {},
) {
  if (backoffFactor === 0) backoffFactor = 1;
  let failureCount = 0;

  const run = async (): Promise<R> => {
    if (initialDelay) {
      await wait(initialDelay);
      initialDelay = 0;
    }
    try {
      return await fn();
    } catch (error) {
      failureCount++;

      if (
        (typeof +retries === "number" && failureCount > +retries) ||
        (typeof retries === "function" && !retries(failureCount, error)) ||
        !["number", "function"].includes(typeof retries)
      ) {
        throw error;
      }
      await wait(delay);
      delay = Math.min(delay * backoffFactor, maxBackOff);
      return run();
    }
  };

  return run();
}
