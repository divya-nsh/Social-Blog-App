import { FormEvent, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useUserContext } from "@/hooks/useUserCtx";
import { useMutation } from "@tanstack/react-query";
import { login as loginApi } from "@/Apis/userApis";
import Alert from "@/components/Alert";
import Button from "@/components/ButtonV2";

type Data = {
  email: string;
  password: string;
};

const intialData = {
  email: "divyanshsoni279@gmail.com",
  password: "1234567890",
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
    <div className="flex min-h-screen items-center justify-center bg-slate-200 text-black dark:text-white">
      <div className="bg-whiter -mt-[1%] h-screen w-full rounded-3xl bg-white px-6 pt-16 sm:h-max sm:w-[450px] sm:px-8 sm:py-8">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="mb-1 flex flex-col items-center gap-2">
            <h1 className="-ml-2 flex items-center gap-2 text-center text-2xl font-bold text-neutral-800">
              <img src="/logo.svg" className="size-8" width={8} height={8} />
              Story Nest
            </h1>
            <p className="text-center text-lg font-medium text-neutral-800">
              Login to your account
            </p>
          </div>
          <Alert type="error" message={error?.message} />
          <div>
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              onChange={handleChange("email")}
              id="email"
              type="email"
              placeholder="example@gmail.com"
              required
              autoFocus
              className="form-input"
              defaultValue={intialData.email}
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              onChange={handleChange("password")}
              id="password"
              type="password"
              className="form-input"
              required
              minLength={8}
              maxLength={64}
              placeholder="********"
              defaultValue={intialData.password}
            />
          </div>

          <Link
            to="/forgot-password"
            className="-mt-2 text-right text-[0.85rem] text-blue-700 hover:underline"
          >
            Forgot Password?
          </Link>

          <Button type="submit" className="mt-1" loading={isPending}>
            Login
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
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
