import { v2 as cloudinary } from "cloudinary";
import { resolveWithRetries } from "../utils/generalUtils.js";

export async function removeImg(public_id = "", invalidate = false) {
  if (!public_id) return;
  return resolveWithRetries(
    () => cloudinary.uploader.destroy(public_id, { invalidate }),
    { delay: 2000, backOffFactor: 2 }
  ).catch((e) => {
    console.log(`Error while deleting image ${public_id}`, e.message);
  });
}
