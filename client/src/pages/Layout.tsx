import { Outlet } from "react-router-dom";
import NavBar from "@/components/Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen border border-transparent bg-slate-100 dark:bg-neutral-900">
      <NavBar />
      <Outlet />
    </div>
  );
}
