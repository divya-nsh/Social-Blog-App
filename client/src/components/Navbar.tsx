import {
  ArrowLeft,
  Bookmarks,
  Gear,
  MagnifyingGlass,
  Moon,
  NotePencil,
  SignOut,
  Sun,
} from "@phosphor-icons/react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useUserContext } from "@/hooks/useUserCtx";
import { Feather, SpinnerGap } from "@phosphor-icons/react";
import useClickOutside from "@/hooks/useClickOutside";
import Logout from "./Logout";

function getTheme() {
  return localStorage.getItem("theme") === "dark" ? "dark" : "light";
}

export default function NavBar() {
  const location = useLocation();
  const { user, status } = useUserContext();
  const [showOption, setShowOption] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [text, setText] = useState("");
  const navigate = useNavigate();
  const [theme, setTheme] = useState<"dark" | "light">(getTheme());
  const dropDownRef = useRef<HTMLDivElement | null>(null);
  const [param] = useSearchParams();
  const [isSearching, setSearching] = useState(false);

  const isSearchPage = location.pathname.startsWith("/search");

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!text) return navigate(`/`);
    if (isSearchPage && param.get("type") === "people") {
      navigate(`/search?q=${text}&type=people`);
    } else {
      navigate(`/search?q=${text}`);
    }
    setTimeout(() => {
      inputRef.current?.blur();
    }, 200);
  };

  useEffect(() => {
    if (!location.pathname.startsWith("/search")) {
      setText("");
    }
  }, [location]);

  useEffect(() => {
    document.documentElement.className = "";
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useClickOutside(dropDownRef, () => setShowOption(false));

  return (
    <>
      <nav className="sticky left-0 right-0 top-0 z-50 flex h-[50px] w-full items-center gap-3 border-b bg-white px-3 dark:border-neutral-700 dark:bg-neutral-800 sm:px-4 md:px-10 lg:px-16">
        {!isSearching ? (
          <>
            <header>
              <h1>
                <NavLink
                  to="/"
                  className="flex items-center gap-2 font-bold text-gray-700 transition-all duration-300 active:text-indigo-500 dark:text-neutral-300"
                >
                  <Feather
                    size={30}
                    weight="fill"
                    color="#0095ff"
                    className=""
                  />
                  <span className={`text-lg sm:block sm:text-xl`}>
                    Story Nest
                  </span>
                </NavLink>
              </h1>
            </header>

            {/* For Mobile button to Expand Search */}
            <button
              title="Search"
              type="submit"
              onClick={() => setSearching(true)}
              className="ml-auto rounded-full bg-slate-200 px-3 py-1.5 active:ring dark:bg-neutral-700 sm:hidden"
            >
              <MagnifyingGlass
                className="text-neutral-700 dark:text-neutral-300"
                size={22}
              />
            </button>

            <div className={`mr-auto hidden flex-1 py-1.5 sm:block`}>
              <form
                id="search-bar"
                onSubmit={handleSearch}
                className="flex w-full items-center gap-2 rounded-2xl border bg-slate-100 px-2 py-1 transition-all duration-300 focus-within:max-w-[500px] focus-within:ring-1 dark:border-neutral-800 dark:bg-neutral-700 sm:max-w-[300px]"
              >
                <button title="search">
                  <MagnifyingGlass color="gray" size={22} />
                </button>

                <input
                  onBlur={() => {
                    if (!isSearchPage) {
                      setSearching(false);
                    }
                  }}
                  ref={inputRef}
                  type="search"
                  placeholder="Search"
                  className={`w-full bg-transparent text-sm outline-none md:text-base`}
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                  }}
                />
              </form>
            </div>

            <div className="flex shrink-0 items-center gap-3 md:gap-6">
              {user && (
                <>
                  <Link
                    className="font-base hidden items-center gap-1 text-lg text-neutral-800 dark:text-neutral-300 sm:flex"
                    to="/compose"
                  >
                    <NotePencil size={30} />
                    <span className="hidden md:block">Write</span>
                  </Link>
                  <div ref={dropDownRef}>
                    <button
                      className="flex items-center transition-all duration-200 active:scale-90"
                      onClick={() => setShowOption(!showOption)}
                    >
                      <img
                        alt="My profile image"
                        src={user?.image.url}
                        width={50}
                        height={50}
                        className="h-11 w-11 rounded-full border object-cover dark:border-neutral-700"
                      />
                    </button>
                    {showOption && (
                      <div
                        className="absolute bottom-0 right-1 z-50 min-w-[220px] translate-y-[100%] gap-1 rounded-lg border bg-white py-1.5 text-sm text-neutral-800 shadow-md dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100 dark:shadow-neutral-950"
                        onClick={() => setShowOption(false)}
                      >
                        <div className="border-b hover:bg-slate-200 dark:border-neutral-600 dark:hover:bg-neutral-700">
                          <Link
                            to={"/profile/" + user?.username}
                            className="group grid px-2 py-2 pl-4"
                          >
                            <span className="ellipsis text-base font-medium group-hover:text-blue-500 group-hover:underline">
                              {user.fullName}
                            </span>
                            <span className="ellipsis text-[0.8rem] text-neutral-700 group-hover:text-blue-500 group-hover:underline dark:text-neutral-200">
                              @{user.username}
                            </span>
                          </Link>
                        </div>

                        <div className="mt-2 w-full hover:bg-slate-200 active:opacity-50 dark:hover:bg-neutral-700">
                          <Link
                            to="/bookmarks"
                            className="flex items-center gap-3 py-2 pl-4"
                          >
                            <Bookmarks size={22} /> Bookmarks
                          </Link>
                        </div>

                        <div className="w-full hover:bg-slate-200 active:opacity-50 dark:hover:bg-neutral-700">
                          <Link
                            to="/compose"
                            className="flex items-center gap-3 py-2 pl-4"
                          >
                            <NotePencil size={22} /> Create post
                          </Link>
                        </div>
                        <div className="w-full hover:bg-slate-200 active:opacity-50 dark:hover:bg-neutral-700">
                          <button
                            className="flex w-full items-center gap-3 py-2 pl-4 text-start"
                            onClick={() =>
                              setTheme(theme === "dark" ? "light" : "dark")
                            }
                          >
                            {theme === "dark" ? (
                              <>
                                <Sun size={22} />
                                Light mode
                              </>
                            ) : (
                              <>
                                <Moon size={22} />
                                Dark mode
                              </>
                            )}
                          </button>
                        </div>
                        <div className="w-full hover:bg-slate-200 active:opacity-50 dark:hover:bg-neutral-700">
                          <Link
                            to="/account-settings"
                            className="flex items-center gap-3 py-2 pl-4"
                          >
                            <Gear size={22} /> Settings
                          </Link>
                        </div>

                        <div className="mt-2 w-full border-t hover:bg-slate-200 active:opacity-50 dark:border-neutral-600 dark:hover:bg-neutral-700">
                          <Logout>
                            {(logout, isPending) => (
                              <button
                                disabled={isPending}
                                onClick={logout}
                                className="flex w-full items-center gap-3 py-2 pl-4 disabled:opacity-50"
                              >
                                <SignOut size={22} /> Sign Out
                              </button>
                            )}
                          </Logout>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {!user && (
                <>
                  <Link
                    className="m rounded-lg bg-blue-600 px-3 py-1 text-sm text-white hover:opacity-80"
                    to="/login"
                  >
                    Login in
                  </Link>
                  <Link
                    className="hidden rounded-lg border border-blue-600 px-3 py-1 text-sm text-blue-600 hover:opacity-80 dark:border-blue-500 dark:text-white sm:block"
                    to="/login"
                  >
                    Signup
                  </Link>
                </>
              )}
              <div className="flex items-center">
                {status === "pending" && (
                  <SpinnerGap
                    size={22}
                    className="animate-spin text-neutral-800 dark:text-neutral-100"
                  />
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex w-full gap-3">
            <button
              onClick={() => setSearching(false)}
              title="back"
              className="text-neutral-800"
            >
              <ArrowLeft size={22} weight="bold" />
            </button>
            <form
              onSubmit={handleSearch}
              className="flex w-full items-center gap-2 rounded-2xl border bg-slate-100 px-2 py-1 transition-all duration-300 focus-within:max-w-[500px] focus-within:ring-1 dark:border-neutral-800 dark:bg-neutral-700"
            >
              <button title="Search">
                <MagnifyingGlass color="gray" size={22} />
              </button>
              <input
                autoFocus
                onBlur={() => {
                  if (!isSearchPage) {
                    setSearching(false);
                  }
                }}
                ref={inputRef}
                type="search"
                placeholder="Search"
                className={`w-full bg-transparent text-sm outline-none md:text-base`}
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                }}
              />
            </form>
          </div>
        )}
      </nav>
    </>
  );
}
