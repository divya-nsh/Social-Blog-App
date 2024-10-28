import React, { useId } from "react";
import { twMerge } from "tailwind-merge";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string | null;
  label: string;
  hints?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ id, label, error, className, ...rest }, ref) => {
    const defaultID = useId();

    return (
      <div className="group grid w-full">
        <label
          htmlFor={id || defaultID}
          className={`pl-0.5 text-sm font-medium transition-all duration-200 ${
            error
              ? "text-red-600 dark:text-[#ff4f46]"
              : "text-black group-focus-within:text-blue-700 dark:text-neutral-100 dark:group-focus-within:text-blue-500"
          }`}
        >
          {label}
        </label>

        <input
          id={id || defaultID}
          className={twMerge(
            "peer mt-0.5 flex w-full items-center rounded-md border border-neutral-300 bg-transparent px-3 py-1.5 opacity-95 outline-none transition-all duration-200 focus:opacity-100 dark:border-neutral-600 dark:text-neutral-100",
            className,
            error
              ? "border-red-600 dark:border-[#ff4f46]"
              : "ring-blue-600 focus:border-blue-600",
          )}
          ref={ref}
          {...rest}
        />

        <small
          role="alert"
          className={`w-full px-1 font-medium text-red-600 transition-all duration-300 dark:text-[#ff4f46] ${
            error ? "visible opacity-100" : "invisible opacity-0"
          }`}
        >
          {error}
        </small>
      </div>
    );
  },
);

type InputWithIconProps = {
  icon: JSX.Element;
  label: string;
  id?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;
export function InputWithIcon({
  label,
  icon,
  id,
  className,
  ...rest
}: InputWithIconProps) {
  const defaultId = useId();
  return (
    <div>
      <label htmlFor={defaultId || id} className="sr-only">
        {label}
      </label>
      <div
        className={twMerge(
          "flex items-center gap-3 rounded-md border px-3 py-2 outline-none transition-all duration-100 focus-within:ring-1 dark:border-neutral-600",
          className,
        )}
      >
        {icon}
        <input
          id={defaultId || id}
          className="w-full bg-transparent text-neutral-800 opacity-90 outline-none focus:opacity-100 dark:text-white"
          {...rest}
        />
      </div>
    </div>
  );
}
