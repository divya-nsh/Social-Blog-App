import { createContext, useContext } from "react";

export const bookmarkCtx = createContext({
  remove: (id: string) => {
    id;
  },
});

export const useBookmarkCtx = () => useContext(bookmarkCtx);
