import { useLocation, useNavigate } from "react-router-dom";
import { useUserContext } from "@/hooks/useUserCtx";
import { useMemo } from "react";

export default function useRequireLogin() {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = !!user;

  return useMemo(
    () => ({
      redirectIfNotLogin: ({
        replace = false,
        returnTo,
      }: {
        returnTo?: string;
        replace?: boolean;
      } = {}) => {
        if (isLogin) return true;
        navigate("/login", {
          state: { from: returnTo ? returnTo : location },
          replace: replace,
        });
        return false;
      },
      isLogin,
    }),
    [location, navigate, isLogin],
  );
}
