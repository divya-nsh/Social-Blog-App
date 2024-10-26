import { useLogoutMut } from "@/hooks/mutationHooks";
import { ReactNode, useCallback } from "react";

type Props = {
  children: (logout: () => void, isPending: boolean) => ReactNode;
};
export default function Logout({ children }: Props) {
  const { logout, isPending } = useLogoutMut();
  const logoutWithConfirm = useCallback(() => {
    setTimeout(() => {
      if (confirm("Are you sure you want to logout?")) logout();
    }, 200);
  }, [logout]);
  return children(logoutWithConfirm, isPending);
}
