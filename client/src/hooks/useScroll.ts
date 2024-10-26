import { scrollFromTop } from "@/lib/utils";
import { useEffect } from "react";

export const useScrollToTop = () => {
  useEffect(() => {
    scrollFromTop(0);
  }, []);
};
