import { reqResetPass } from "@/Apis/userApis";
import Button from "@/components/ButtonV2";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle } from "@phosphor-icons/react";
import React from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { FormInput } from "@/components/Input";

function ForgotPassword() {
  const { isPending, mutate, isSuccess } = useMutation({
    mutationFn: reqResetPass,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    if (!email) return toast.error("Error");
    mutate(email + "");
  };

  return (
    <div className="blue-spots-bg-img dark flex min-h-screen items-center justify-center text-white">
      <div className="min-h-screen w-full gap-4 rounded-lg bg-neutral-800 p-8 px-4 pt-10 shadow-md sm:min-h-max sm:max-w-[450px] sm:px-8 sm:pt-8">
        <form onSubmit={handleSubmit} className="grid w-full gap-5">
          <div>
            <h1 className="text-2xl font-medium">Forgot Password?</h1>
            <p className="mt-1 text-[0.85rem] text-neutral-100">
              Enter the email associated with your account
            </p>
          </div>

          {isSuccess && (
            <div
              className="flex animate-fadeIn-0.3 rounded-lg border border-green-500 p-4 text-sm text-green-500"
              role="alert"
            >
              <span className="mr-2">
                <CheckCircle size={35} weight="fill" />
              </span>
              <div className="font-medium">
                <p>
                  We&apos;ve sent you an email. Please check your inbox and
                  follow the instructions to get back your account.
                </p>
              </div>
            </div>
          )}

          <FormInput
            label="Your Email"
            name="email"
            type="email"
            placeholder="john@gmail.com"
            required
            autoFocus
            autoComplete="email"
          />

          <Button loading={isPending}>Send Email</Button>
        </form>
        <Link
          to="/login"
          className="mt-2 block text-sm text-blue-500 hover:underline"
        >
          Go back to Login
        </Link>
      </div>
    </div>
  );
}

export default ForgotPassword;
