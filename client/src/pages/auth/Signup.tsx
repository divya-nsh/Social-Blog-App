import { FormEvent, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useUserContext } from "@/hooks/useUserCtx";
import { createUser } from "@/Apis/userApis";
import { useMutation } from "@tanstack/react-query";
import Alert from "@/components/Alert";
import Button from "@/components/ButtonV2";
import { FormInput } from "@/components/Input";

const intialValue = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

type Data = typeof intialValue;

export const Signup = () => {
  const [formData, setFormData] = useState(intialValue);
  const { setUser } = useUserContext();
  const navigate = useNavigate();
  const location = useLocation();

  const { isPending, mutate, error } = useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      const from = location.state?.from?.pathname || "/";
      setUser(data.user);
      navigate(from, { replace: true });
    },
  });

  const handleChange = (key: keyof Data) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((p) => ({ ...p, [key]: e.target.value }));
    };
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    mutate(formData);
  };

  return (
    <div className="blue-spots-bg-img dark flex min-h-screen items-center justify-center text-white">
      <div className="min-h-screen w-full gap-4 rounded-lg bg-neutral-800 p-8 px-4 pt-10 shadow-md sm:min-h-max sm:max-w-[450px] sm:px-8 sm:pt-8">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="-mt-2 mb-1 flex flex-col items-center gap-3">
            <h1 className="-ml-2 flex items-center gap-2 text-center text-xl font-bold text-white">
              <img src="/logo.svg" className="size-8" width={8} height={8} />
              Story Nest
            </h1>
            <p className="text-center text-xl font-medium text-neutral-200">
              Create an Account
            </p>
          </div>
          <Alert type="error" message={error?.message} className="-mt-3" />

          <FormInput
            label="Name"
            type="text"
            onChange={handleChange("email")}
            placeholder="John doe"
            required
            autoFocus
            autoComplete="email"
          />

          <FormInput
            label="Email"
            type="email"
            onChange={handleChange("email")}
            placeholder="john@gmail.com"
            required
            autoFocus
            autoComplete="email"
          />

          <FormInput
            label="Password"
            type="password"
            onChange={handleChange("password")}
            required
            minLength={8}
            maxLength={64}
            placeholder="********"
            autoComplete="new-password"
          />

          <FormInput
            label="Password"
            type="password"
            onChange={handleChange("password")}
            required
            minLength={8}
            maxLength={64}
            placeholder="********"
            autoComplete="new-password"
          />

          <Button type="submit" className="mt-1" loading={isPending}>
            Signup
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-neutral-200">
          Aldready have an account?
          <Link
            to="/login"
            className="ml-2 text-base text-blue-500 hover:underline"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};
