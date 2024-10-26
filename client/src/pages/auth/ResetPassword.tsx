import { resetPassword } from "@/Apis/userApis";
import Alert from "@/components/Alert";
import Button from "@/components/ButtonV2";
import { FormInput } from "@/components/Input";
import { useUserContext } from "@/hooks/useUserCtx";
import { ApiError } from "@/types/indext";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export default function ResetPassword() {
  const { setUser } = useUserContext();
  const [params] = useSearchParams();
  const [newPassword, setNewPass] = useState("");
  const navigate = useNavigate();
  const token = params.get("token") || "";

  const {
    isPending,
    mutate,
    error: e,
  } = useMutation({
    mutationFn: resetPassword,
    onSuccess(user) {
      setUser(user);
      toast.success("Your password Updated");
      navigate("/", { replace: true });
    },
    onError(e) {
      const error = e as ApiError;
      if (error.status === 401) {
        // toast.error(
        //   "Invalid Reset password link or expired , Request new link",
        //   {
        //     duration: 7000,
        //     style: {
        //       backgroundColor: "#ed2626",
        //       color: "ghostwhite",
        //       fontSize: "0.9rem",
        //     },
        //   },
        // );
        // navigate("/forgot-password");
      }
    },
  });

  const error = e as ApiError | null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({ token, newPassword });
  };

  useEffect(() => {
    if (!token) navigate("/forgot-password");
  }, [navigate, token]);

  return (
    <div className="blue-spots-bg-img dark flex min-h-screen items-center justify-center">
      <div className="min-h-screen w-full gap-4 rounded-lg bg-neutral-800 p-8 px-4 pt-10 shadow-md sm:min-h-max sm:max-w-[450px] sm:px-8 sm:pt-8">
        <form onSubmit={handleSubmit} className="grid w-full gap-5">
          <h1 className="text-2xl font-medium text-neutral-100">
            Change Your Password
          </h1>
          <Alert type="error" message={error?.message} className="-mt-3" />

          <FormInput
            label="New Password"
            type="password"
            required
            onChange={(e) => setNewPass(e.target.value)}
            min={8}
            maxLength={64}
            autoFocus
          />
          <FormInput
            label="Confirm Password"
            type="password"
            required
            // pattern={newPassword}
            // min={8}
            // maxLength={64}
            title="Both Password Must Match"
          />
          <Button loading={isPending} type="submit">
            Change Password
          </Button>
        </form>
        <Link
          to="/forgot-password"
          className="mt-2.5 block text-sm text-blue-500 hover:underline"
        >
          Request New Link
        </Link>
      </div>
    </div>
  );
}
