// import { getMe, login } from "@/Apis/userApis";
// import Button from "@/components/Button";
// import { retryHandler, wait } from "@/lib/utils";
// import { ApiError, User } from "@/types/indext";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import axios, { AxiosError } from "axios";
// import React, { useCallback } from "react";
// import toast from "react-hot-toast";

import ButtonV2 from "@/components/ButtonV2";

export default function Test() {
  return (
    <div className="bg-white p-6">
      <div className="bg-whit mx-auto h-[400px] max-w-3xl gap-2">
        <ButtonV2 variants="outlined">Name</ButtonV2>
      </div>
    </div>
  );
}

// function Component2() {
//   useLoginUser();
//   return <div>Component 2</div>;
// }

// export function useLoginUser() {
//   const queryClient = useQueryClient();
//   const query = useQuery<User, ApiError>({
//     queryFn: () => getMe(),
//     queryKey: ["login-user"],
//     staleTime: Infinity,
//     gcTime: Infinity,
//   });

//   const logout = useCallback(() => {
//     document.cookie = `access_token=null; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/api;`;
//     document.cookie = `access_token=null; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
//     window.location.reload();
//   }, []);

//   const setUser = useCallback(
//     (user: User | null) => {
//       queryClient.setQueryData(["user/me"], user);
//     },
//     [queryClient],
//   );

//   return { ...query, setUser, logout };
// }

// export function useLoginMut() {
//   const queryClient = useQueryClient();
//   const mutation = useMutation({
//     mutationFn: login,
//     onSuccess: (data) => {
//       queryClient.setQueryData(["user/me"], data.user);
//       window.location.reload();
//     },
//     onError: (error: AxiosError<ApiError>) => {
//       console.log(error);
//     },
//   });
// }
