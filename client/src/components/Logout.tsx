import { ReactNode, useCallback } from "react";

type Props = {
  children: (logout: () => void) => ReactNode;
};

export default function Logout({ children }: Props) {
  const logoutWithConfirm = useCallback(() => {
    setTimeout(() => {
      if (confirm("Are you sure you want to logout?")) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("login-user");
        window.location.reload();
      }
    }, 200);
  }, []);
  return children(logoutWithConfirm);
}
