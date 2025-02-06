import {
  ArrowClockwise,
  ArrowCounterClockwise,
  ArrowLeft,
  MagnifyingGlassMinus,
  MagnifyingGlassPlus,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import Cropper, { Area, Size } from "react-easy-crop";
import toast from "react-hot-toast";

export default function ImageCropperModal({
  img,
  onSave,
  onModalClose,
  cropShape,
  aspect = 1,
  cropSize,
}: {
  img: string;
  onSave?: (canva: HTMLCanvasElement) => void;
  onModalClose: () => void;
  cropShape?: "round" | "rect";
  aspect?: number;
  cropSize?: Size;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotate, setRotate] = useState(0);
  const croppedAreaRef = useRef<Area | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [isLoading, setLoading] = useState(false);

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    croppedAreaRef.current = croppedAreaPixels; // Save pixel data
  };

  const onSubmit = () => {
    const area = croppedAreaRef.current;
    if (!area || !img) return;
    setLoading(true);
    setTimeout(() => {
      // Crop Image is mostly syncronous to enhance ux i have added some loading state before it start cropping
      cropImage(img, area, rotate)
        .then(onSave)
        .catch(() => toast.error("Something went's wrong"));
    }, 200);
  };

  useEffect(() => {
    const modal = dialogRef.current;
    if (!modal) return;
    if (!modal.open) {
      modal.showModal();
      return () => modal.close();
    }
  }, []);

  const rotateLeft = () => setRotate((prev) => (prev === 0 ? 270 : prev - 90));
  const rotateRight = () => setRotate((prev) => (prev === 270 ? 0 : prev + 90));

  return (
    <dialog
      ref={dialogRef}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          onModalClose?.();
        }
      }}
      className="flex h-full w-full items-center justify-center bg-transparent"
    >
      <div
        className="grid h-full max-h-[550px] w-[500px] grid-rows-3 rounded-xl border-2 border-neutral-300 bg-white text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200"
        style={{
          gridTemplateRows: "40px 1fr auto",
        }}
      >
        <div className="flex items-center gap-4 px-4">
          <button
            onClick={() => onModalClose()}
            aria-label="Go Back"
            className="rounded-full p-1 text-2xl font-medium outline-none transition-transform duration-200 hover:bg-slate-100 active:scale-95 dark:hover:bg-neutral-800"
          >
            <ArrowLeft size={25} />
          </button>
          <h2 className="font-medium">Crop Image</h2>
          <div className="ml-auto flex items-center gap-2 text-neutral-800 dark:text-neutral-200">
            <button onClick={rotateLeft} title="Rotate left">
              <ArrowCounterClockwise size={22} weight="bold" />
            </button>
            <button onClick={rotateRight} title="Rotate right">
              <ArrowClockwise size={22} weight="bold" />
            </button>
          </div>
        </div>

        <div
          className="relative bg-[#1a1a1a]"
          // style={{
          //   backgroundImage:
          //     "radial-gradient(circle, rgba(255, 255, 255, 0.5) 10%, rgba(255, 255, 255, 0) 10%)",
          //   backgroundSize: "10px 10px",
          // }}
        >
          <Cropper
            rotation={rotate}
            image={img}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropSize={cropSize}
            cropShape={cropShape}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>

        <div className="flex flex-wrap justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-2">
            <MagnifyingGlassMinus size={22} />
            <input
              onChange={(e) => {
                setZoom(Number(e.target.value));
              }}
              id="zoom"
              type="range"
              className="w-[200px] cursor-pointer"
              min={1}
              max={10}
              step={0.03}
              value={zoom}
            />
            <MagnifyingGlassPlus size={22} />
          </div>

          <button
            disabled={isLoading}
            onClick={onSubmit}
            className="rounded-full bg-blue-600 px-6 py-1 font-medium text-white transition-transform duration-200 hover:opacity-90 active:scale-95 active:opacity-70"
          >
            {isLoading ? "Crop..." : "Crop"}
          </button>
        </div>
      </div>
    </dialog>
  );
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}

async function cropImage(
  imgURL: string,
  cropAreaPixels: Area,
  rotateDeg: number = 0,
) {
  const img = await (rotateDeg === 0
    ? createImage(imgURL)
    : getRotatedImg(imgURL, rotateDeg));

  const canva = document.createElement("canvas");
  canva.width = cropAreaPixels.width;
  canva.height = cropAreaPixels.height;
  const ctx = canva.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  ctx.drawImage(
    img,
    cropAreaPixels.x, // Source X
    cropAreaPixels.y, // Source Y
    cropAreaPixels.width, // Source width
    cropAreaPixels.height, // Source height
    0, // Target X
    0, // Target Y
    cropAreaPixels.width, // Target width
    cropAreaPixels.height, // Target height
  );

  return canva;
}

function degreesToRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

//Only support for - 0|90|180|270
async function getRotatedImg(
  imgURL: string,
  rotateDeg: number,
): Promise<HTMLCanvasElement> {
  if (![0, 90, 180, 270].includes(rotateDeg)) {
    throw new Error("Only 0, 90, 180, and 270 degrees are supported.");
  }
  const img = await createImage(imgURL);

  const canva = document.createElement("canvas");
  const ctx = canva.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");
  canva.width = img.width;
  canva.height = img.height;
  if (rotateDeg === 90 || rotateDeg == 270) {
    canva.width = img.height;
    canva.height = img.width;
  }

  ctx.translate(canva.width / 2, canva.height / 2);
  ctx.rotate(degreesToRadians(rotateDeg));
  ctx.drawImage(img, -img.width / 2, -img.height / 2);
  return canva;
}
