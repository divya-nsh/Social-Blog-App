import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export function ErrorBoundary() {
  const error = useRouteError() as Error;

  const is404 = isRouteErrorResponse(error) && error.status === 404;
  const isDev = process.env.NODE_ENV === "development";
  return (
    <div className="absolute left-0 top-0 flex min-h-screen w-full flex-col justify-center p-4">
      {is404 ? (
        <div className="-mt-[10%] text-center">
          <h1 className="mb-2 text-8xl font-bold text-red-500">404</h1>
          <h2 className="mt-3 text-3xl text-neutral-800">
            Oops! page not found
          </h2>
          <a
            href="/"
            className="mt-6 inline-block rounded-md bg-blue-600 px-4 py-2 text-white transition-all duration-300 hover:opacity-90 active:scale-90"
          >
            Go Home
          </a>
        </div>
      ) : (
        <div className="-mt-[10%] text-center">
          <h1 className="text-3xl font-bold text-red-600 dark:text-red-500">
            Oops! Something went wrong
          </h1>
          <p className="mt-3 text-2xl text-neutral-800">
            Unexpected error occur
          </p>
          <p className="mt-3 text-lg text-neutral-800">
            Please try reloading the page or try again later. If issue persist
            please contact us
          </p>
        </div>
      )}
      {isDev && !is404 && (
        <div className="mt-4 w-full space-y-2 border-t pt-2.5 text-start">
          <h1
            className="break-words text-center text-lg"
            hidden={!!error.stack}
          >
            {error.name || "Error"} : {error.message || JSON.stringify(error)}
          </h1>
          {error.stack && (
            <pre className="w-full overflow-auto rounded-lg bg-neutral-600 p-6 text-start text-white">
              {error.stack}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
