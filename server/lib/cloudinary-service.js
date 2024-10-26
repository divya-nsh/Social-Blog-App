import { v2 as cloudinary } from "cloudinary";
import { resolveWithRetries } from "../utils/generalUtils.js";

export function removeImgInBackground(
  public_id = "",
  code = "IMAGE_REMOVE",
  invalidate = false
) {
  if (!public_id) return;
  resolveWithRetries(
    () => cloudinary.uploader.destroy(public_id, { invalidate }),
    { delay: 2000, backOffFactor: 2 }
  )
    .then(() => {
      console.log("🎉", code);
    })
    .catch((e) => {
      console.log(`Error while deleting image ${public_id}`, e.message);
    });
}
