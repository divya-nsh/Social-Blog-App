import { AxiosError } from "axios";

export const mergeCls = (...value: Array<unknown>) => {
  return value
    .filter((v) => typeof v === "string")
    .map((v) => v.trim())
    .join(" ");
};

export const startClock = () => {
  const now = performance.now();

  return {
    get timeElapsed() {
      const ms = Math.floor(performance.now() - now);
      return formatTime(ms);
    },
    get elpasedMs() {
      return Math.floor(performance.now() - now);
    },
  };
};

function formatTime(time: number) {
  const SECOND = 1000;
  const MINUTE = SECOND * 60;
  const HOUR = MINUTE * 60;
  if (time < SECOND) return time + "ms";
  if (time < MINUTE) return (time / SECOND).toFixed(2) + "s";
  if (time < HOUR) return (time / MINUTE).toFixed(2) + "m";
  return (time / HOUR).toFixed(2) + "h";
}

// export const getCloudinaryConfig = () => {
//   const config = {
//     apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
//     cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
//     uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
//   };
//   if (!config.apiKey || !config.cloudName || !config.uploadPreset) {
//     throw new Error(
//       "Cloudinary environment variables are not defined (VITE_CLOUDINARY_API_KEY,VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET) ",
//     );
//   }
//   return config;
// };

export function scrollFromTop(y: number) {
  document.documentElement.scrollTop = y;
  document.body.scrollTop = y; // For older browsers
}

export const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const getFakeAction = (ms?: number, res: boolean = true) => {
  return async (arg: unknown): Promise<void> => {
    arg;
    await wait(ms || 2000);
    if (!res) throw new Error("Something is wrong");
  };
};

export const PLACEHOLDER_USER_IMG = "/placeholder-avatar.jpg";

export const retryHandler = (count = 3) => {
  return (failureCount: number, error: unknown) => {
    if (error instanceof AxiosError && failureCount < count) {
      if (error.status && error.status >= 400 && error.status < 500) {
        return false;
      }
      return true;
    }
    return false;
  };
};

export function generateInitialsAvatar(text: string, size = 400) {
  // Get the first letter of the first name
  const colors = [
    "#3498db", // Blue
    "#e03737", // Red
    "#4ce06f", // Green
    "#cd43da", // Purple
    "#2b36cb", // Dark Blue
    "#e66430", // Orange
    "#00A1FF", // Bright Blue
    "#14a145", // Bright Green
    "#ee4396", // Bright Pink
    "#edcd2e", // Yellow
    "#34c3c3", // Cyan
    "#9B59B6", // Light Purple
  ];
  const initial = text.charAt(0).toUpperCase();
  let acc = 0;
  for (let i = 0; i < Math.min(text.length, 30); i++) {
    acc += text.charCodeAt(i);
  }
  const hash = acc % colors.length;
  const bg = colors[hash];
  // Create SVG markup
  const svg = `
        <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="${bg}" />
            <text x="50%" y="50%" alignment-baseline="central" text-anchor="middle" font-size="${size * 0.4}" fill="${"#f3ecec"}" font-family="Arial" dominant-baseline="middle">
                ${initial}
            </text>
        </svg>
    `;

  // Return the SVG markup
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const loadImg = (url: string): Promise<HTMLImageElement> =>
  new Promise((res, rej) => {
    const img = new Image();
    img.src = url;
    img.onload = () => res(img);
    img.onerror = (e) => rej(e);
  });

export async function imgSquareResize(img: string, size: number) {
  const image = await loadImg(img);
  const canva = document.createElement("canvas");
  canva.width = size;
  canva.height = size;
  const ctx = canva.getContext("2d");
  if (!ctx) throw new Error("Could not get 2d context");
  const imgSize = Math.min(image.naturalWidth, image.naturalHeight);
  ctx.drawImage(
    image,
    Math.max(image.naturalWidth / 2 - imgSize / 2, 0), // crop start
    Math.max(image.naturalHeight / 2 - imgSize / 2, 0), // y-coordinate of the top-left corner of the source image to start cropping.
    imgSize, //crop width
    imgSize, //crop height
    0, //x-coordinate  to place image
    0, //y-coordinate  to place image
    size, //width of image
    size, //height of image
  );
  return canva;
}
