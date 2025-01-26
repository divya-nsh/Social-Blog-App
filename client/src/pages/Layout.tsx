import { Outlet } from "react-router-dom";
import NavBar from "@/components/Navbar";

export default function Layout() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}
