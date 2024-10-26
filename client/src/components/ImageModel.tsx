import useClickOutside from "@/hooks/useClickOutside";
import { ReactNode, useRef, useState } from "react";

export function ImageModal({
  children,
}: {
  children?: (opt: { open: (url: string) => void }) => ReactNode;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");

  useClickOutside(imgRef, () => setIsOpen(false));

  return (
    <>
      {children?.({
        open: (url) => {
          setIsOpen(true);
          setUrl(url);
        },
      })}

      {isOpen && (
        <div
          onClick={() => {
            setIsOpen(false);
          }}
          className={`fixed inset-0 z-50 flex animate-fadeIn items-center justify-center bg-black/90 backdrop-blur-sm transition-all duration-300`}
        >
          <button
            onClick={() => {
              setIsOpen(false);
            }}
            autoFocus
            type="button"
            className="absolute right-0 top-0 m-4 rounded-md bg-black px-4 py-2 font-medium text-white ring-1 backdrop-blur-sm transition-all duration-200 hover:opacity-80 focus:ring active:scale-95"
          >
            Close
          </button>
          <img
            onClick={(e) => e.stopPropagation()}
            ref={imgRef}
            src={url}
            alt="User avatar Full priview"
            className="max-h-full max-w-full rounded-md object-contain shadow-lg transition-all duration-200"
          />
        </div>
      )}
    </>
  );
}
