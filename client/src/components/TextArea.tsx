import { forwardRef, useId, useState } from "react";
import { twMerge } from "tailwind-merge";

interface FormInputProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string | null;
  label: string;
  hints?: string;
  enableCount?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, FormInputProps>(
  (
    { id, label, error, className, enableCount = false, onChange, ...rest },
    ref,
  ) => {
    const defaultID = useId();
    const intialLength = (rest?.defaultValue?.toString() || "").length;
    const [charCount, setCharCount] = useState(intialLength);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (rest.value === undefined && enableCount) {
        setCharCount(e.target.value.length);
      }
      onChange?.(e);
    };

    // Character count when controlled or uncontrolled
    const _charCount =
      rest.value === undefined ? charCount : rest?.value.toString().length;
    return (
      <div className="group grid w-full">
        <div className="flex flex-wrap items-center justify-between gap-1">
          <label
            htmlFor={id || defaultID}
            className={twMerge(
              `ransition-all pl-0.5 text-sm font-medium duration-200`,
              error ? "text-red-600" : "text-neutral-700 dark:text-neutral-100",
            )}
          >
            {label}
          </label>
          {enableCount && (
            <small className="w-max px-2 text-right text-neutral-600 group-focus-within:text-blue-600 dark:text-neutral-300">{`${_charCount}/${
              rest?.maxLength || ""
            }`}</small>
          )}
        </div>

        <textarea
          id={id || defaultID}
          className={twMerge(
            "peer mt-1 flex w-full items-center rounded-md border bg-transparent px-3 py-2 text-sm outline-none transition-all duration-300 dark:border-neutral-600",
            error
              ? "border-red-600"
              : "border-neutral-300 focus:border-blue-600 dark:focus:ring-white",
            className,
          )}
          onChange={handleChange}
          ref={ref}
          {...rest}
        />

        <small
          role="alert"
          className={`w-full px-1 font-medium text-red-600 transition-all duration-300 ${
            error ? "visible opacity-100" : "invisible opacity-0"
          }`}
        >
          {error}
        </small>
      </div>
    );
  },
);

TextArea.displayName = "TextArea";
