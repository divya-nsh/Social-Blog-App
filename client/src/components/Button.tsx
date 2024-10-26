/* eslint-disable @typescript-eslint/no-unused-vars */
import { SpinnerGap } from "@phosphor-icons/react";
import React, { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

const variants = {
  primary: "bg-blue-600 text-neutral-100",
  outline: "border border-neutral-300",
  danger: "bg-red-500 text-neutral-100",
};

interface MyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loader?: ReactNode;
  loadingText?: string;
  variants?: keyof typeof variants;
}

export default function Button({
  onClick = () => {},
  children,
  className,
  disabled,
  isLoading,
  loader,
  loadingText = "",
  title,
  ...rest
}: MyButtonProps) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={twMerge(
        `inline-flex items-center justify-center gap-1 rounded-md bg-blue-600 px-4 py-2 text-slate-50 transition-all duration-300`,
        disabled || isLoading
          ? "cursor-not-allowed opacity-95"
          : "hover:opacity-90 hover:shadow-md active:scale-90",
        className,
      )}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <>
          <span>{loadingText}</span>
          <SpinnerGap size={27} className="animate-spin text-white" />
        </>
      ) : (
        children
      )}
    </button>
  );
}
