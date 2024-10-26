/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

type CB<D> = {
  onSuccess?: (data: D) => void;
  onError?: (data: D) => void;
};

const useApiRq = <D, B = void>(
  path: string,
  method: string,
  cb: CB<D> = {},
) => {
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [data, setData] = useState<D | null>(null);
  const [error, setError] = useState<AxiosError | null>(null);

  const execute = async (body: B) => {
    setStatus("pending");
    try {
      const res = await axios.request({
        url: path,
        method,
        data: body,
      });
      setData(res.data);
      setStatus("success");
      cb.onSuccess?.(res.data);
    } catch (error) {
      setError(error as AxiosError);
      setStatus("error");
      cb.onError?.(error as D);
    }
  };

  return {
    status,
    data,
    error,
    execute,
    isPending: status === "pending",
  };
};
