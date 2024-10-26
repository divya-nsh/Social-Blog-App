import React, { useState } from "react";

export const useHandleChange = <T extends object>(intialValue: T) => {
  const [formData, setFormData] = useState<T>(intialValue);
  function setNestedObj(
    obj: Record<string, unknown>,
    value: unknown,
    key: string,
  ) {
    const keys = key.split(".");
    const last = keys.pop()!;
    let nestedObj = obj;
    for (const key of keys) {
      if (typeof nestedObj[key] !== "object" || nestedObj[key] === null) {
        nestedObj[key] = {}; // If the next level is not an object, create an empty object
      }
      nestedObj = nestedObj[key] as Record<string, unknown>;
    }
    nestedObj[last] = value;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newData = { ...formData };
    setNestedObj(
      newData as Record<string, unknown>,
      e.target.value,
      e.target.name,
    );
    setFormData(newData);
  };

  return [formData, handleChange, setFormData] as [
    T,
    typeof handleChange,
    React.Dispatch<React.SetStateAction<T>>,
  ];
};
