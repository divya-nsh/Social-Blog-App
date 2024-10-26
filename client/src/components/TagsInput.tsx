/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";

//")" //Check if its allowed
//" " // ignore white space
//"hello " //add new tag
//"" & Backspace  //remove previous tag

type Props = {
  onChange?: (tags: string[]) => void;
  defaultValue?: string[];
  disabled?: boolean;
  name?: string;
  maxTag?: number;
  allowedChar?: RegExp;
};

export default function TagsInput({
  onChange,
  defaultValue = [],
  disabled = false,
  name,
  maxTag = 5,
  allowedChar,
}: Props) {
  const [tags, setTags] = useState<string[]>(defaultValue);
  const [input, setInput] = useState("");
  //Add a tag on fullfillment of certain requirement

  const handleChangeV2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const lastChar = e.target.value[e.target.value.length - 1];
    const value = e.target.value;
    if (tags.length === maxTag || value === " ") return;
    if (/\s$/.test(value) || value.length >= 30) {
      if (!tags.includes(value.trim())) {
        setTags((prev) => {
          const newTags = [...prev, value.trim()];
          onChange && onChange(newTags);
          return newTags;
        });
      }
      setInput("");
    } else setInput(value);
  };

  const deleteTag = (index: number) => {
    setTags((prev) => {
      const newTags = prev.filter((_, i) => i !== index);
      onChange && onChange(newTags);
      return newTags;
    });
  };

  return (
    <div
      className={
        ":text-white mt-4 flex flex-wrap gap-2 rounded-md border px-2 py-2 dark:bg-transparent"
      }
    >
      {tags.map((tag, i) => (
        <div
          key={i}
          className="relative flex items-center rounded-2xl border bg-slate-200 px-4 py-1 text-sm text-black dark:bg-neutral-600 dark:text-neutral-200"
        >
          {tag}
          <button
            type="button"
            className="ml-1.5 text-[12px] text-neutral-900 hover:text-blue-700 dark:text-neutral-300 dark:hover:text-blue-500"
            onClick={() => deleteTag(i)}
          >
            ✖
          </button>
        </div>
      ))}
      <input
        value={input}
        type="text"
        name="x"
        placeholder="Add a tags upto 5..."
        className="ml-1 min-w-fit max-w-full flex-1 bg-transparent outline-none dark:text-neutral-200"
        disabled={disabled}
        onChange={handleChangeV2}
        onKeyDown={(e) => {
          if (e.key === "Backspace" && e.currentTarget.value === "") {
            deleteTag(tags.length - 1);
          } else if (e.key === "Space") {
            setTags((p) => [...p]);
          }
        }}
      />
      {name && <input type="hidden" name={name} value={tags.join(" ")} />}
    </div>
  );
}
