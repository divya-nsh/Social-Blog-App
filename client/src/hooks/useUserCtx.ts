import { UserContext } from "@/context/userContex";
import { useContext } from "react";

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context)
    throw new Error("useUserContext must be used within a UserProvider");
  return context;
};
