import useRequireLogin from "@/hooks/useRequireLogin";
import { ReactNode } from "react";
import { useUserContext } from "@/hooks/useUserCtx";

export function Private({ comp }: { comp: ReactNode }) {
  const { status, user } = useUserContext();
  const { redirectIfNotLogin } = useRequireLogin();
  if (status === "pending") {
    return <div className="mt-4 animate-pulse text-center">Loading...</div>;
  }
  if (!user) return redirectIfNotLogin({ replace: true });
  return comp;
}
