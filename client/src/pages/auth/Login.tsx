import { FormEvent, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useUserContext } from "@/hooks/useUserCtx";
import { useMutation } from "@tanstack/react-query";
import { login as loginApi } from "@/Apis/userApis";
import Alert from "@/components/Alert";
import { FormInput } from "@/components/Input";
import Button from "@/components/ButtonV2";
import GoogleLoginbtn from "./GoogleLoginbtn";

type Data = {
  email: string;
  password: string;
};

const intialData = {
  email: "",
  password: "",
};

export default function LoginV2() {
  const formDataRef = useRef(intialData);
  const { setUser } = useUserContext();
  const location = useLocation();
  const navigate = useNavigate();

  const { isPending, mutate, error } = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      const from = location.state?.from?.pathname || "/";
      setUser(data.user);
      navigate(from, { replace: true });
    },
  });

  const handleChange = (key: keyof Data) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      formDataRef.current[key] = e.target.value;
    };
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    mutate(formDataRef.current);
  };

  return (
    <div className="blue-spots-bg-img dark flex min-h-screen items-center justify-center text-white">
      <div className="w-[450px] gap-4 rounded-lg bg-neutral-800 px-6 py-10 shadow-md sm:p-10">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="-mt-2 mb-1 flex flex-col items-center gap-3">
            <Link
              to="/"
              className="-ml-2 flex items-center gap-2 text-center text-2xl font-bold text-white"
            >
              <img src="/logo.svg" className="size-8" width={8} height={8} />
              Story Nest
            </Link>
            <h1 className="text-center text-xl font-medium text-neutral-200">
              Login to your account
            </h1>
          </div>
          <Alert type="error" message={error?.message} />
          <FormInput
            label="Email"
            type="email"
            onChange={handleChange("email")}
            placeholder="example@gmail.com"
            required
            autoFocus
            defaultValue={intialData.email}
            autoComplete="email"
          />
          <FormInput
            label="Password"
            type="password"
            onChange={handleChange("password")}
            defaultValue={intialData.password}
            required
            minLength={8}
            maxLength={64}
            placeholder="********"
            autoComplete="current-password"
          />
          <Link
            to="/forgot-password"
            className="-mt-2 text-right text-[0.81rem] text-blue-500 hover:underline"
          >
            Forgot Password?
          </Link>

          <Button type="submit" className="mt-1" loading={isPending}>
            Login
          </Button>
        </form>

        <GoogleLoginbtn />

        <div className="mt-6 text-center text-sm text-neutral-200">
          Don&apos;t have an account?
          <Link
            to="/signup"
            className="ml-1.5 text-base text-blue-500 hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
