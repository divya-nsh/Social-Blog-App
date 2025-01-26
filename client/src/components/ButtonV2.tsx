/* eslint-disable @typescript-eslint/no-unused-vars */
import { SpinnerGap } from "@phosphor-icons/react";
import React from "react";
import { twMerge } from "tailwind-merge";

type BtnProp = {
  variants?: "Primary" | "outlined" | "text" | "danger";
  size?: "small" | "large" | "medium";
  children?: React.ReactNode;
  className?: string;
  loading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = React.forwardRef<HTMLButtonElement, BtnProp>(
  (
    {
      variants = "Primary",
      size = "medium",
      className,
      children,
      loading = false,
      type = "button",
      disabled = false,
      ...rest
    },
    ref,
  ) => {
    return (
      <button
        className={twMerge(
          "flex items-center justify-center rounded-md px-4 py-2 text-white transition-all duration-300 hover:opacity-90 hover:shadow-sm enabled:active:scale-95 disabled:cursor-not-allowed disabled:opacity-80 disabled:shadow-inner",
          variants === "Primary" && "bg-blue-600",
          variants === "outlined" &&
            "border border-neutral-500 text-neutral-900 hover:opacity-100 hover:ring dark:border-neutral-500 dark:text-white",
          variants === "text" && "text-blue-600 hover:bg-blue-100",
          variants === "danger" && "bg-red-500",
          className,
        )}
        ref={ref}
        type={type}
        disabled={disabled || loading}
        {...rest}
      >
        {loading ? (
          <SpinnerGap size={27} className="animate-spin text-white" />
        ) : (
          children
        )}
      </button>
    );
  },
);

export default Button;
