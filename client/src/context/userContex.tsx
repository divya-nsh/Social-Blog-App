import { createContext, useEffect, useState } from "react";
import { ReactNode } from "react";
import { ApiState, User } from "../types/indext";
import { AxiosError } from "axios";
import { getMe } from "@/Apis/userApis";
import toast from "react-hot-toast";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { resolveWithRetries } from "@/lib/retry-resolve";
import { retryHandler } from "@/lib/utils";

export interface IUserContext {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  status: ApiState;
}

export const UserContext = createContext<IUserContext | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useLocalStorage<null | User>("login-user", null);
  const [status, setState] = useState<ApiState>("pending");

  useEffect(() => {
    resolveWithRetries(getMe, {
      retries: retryHandler(4),
    })
      .then((user) => {
        setUser(user);
        setState("success");
      })
      .catch((e) => {
        setState("error");
        if (e instanceof AxiosError) {
          if (e.response?.status === 401) {
            return setUser(null);
          }
          toast.error("Failed to fetch login detail", { id: "fsddsa" });
        }
      });
  }, [setUser]);

  return (
    <UserContext.Provider
      value={{
        status,
        user: user,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// const OneTapLogin = () => {
//   useGoogleOneTapLogin({
//     onSuccess: async (res) => {
//       await apiRq.post(`api/user/google-login`, {
//         idToken: res.credential,
//       });
//       toast.loading("Logging in...");
//       window.location.reload();
//     },
//   });
//   return <></>;
// };
