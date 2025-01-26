import multer from "multer";
import { cloudinaryStorage } from "../lib/Cloudinary-Storage.js";

export const userImgUploader = multer({
  storage: cloudinaryStorage({
    transformation: {
      width: 300,
      height: 300,
      format: "jpg",
      crop: "fill",
      gravity: "face",
    },
    folder: "user-avatar",
    resource_type: "image",
  }),
  limits: { fileSize: 1024 * 1024 * 5 },
});

export const postImgUploader = multer({
  storage: cloudinaryStorage({
    transformation: {
      width: 1000,
      aspect_ratio: "16:9",
      format: "jpg",
      crop: "fill",
    },
    resource_type: "image",
    folder: "post-image",
    tags: ["cover_img", "thumbnail"],
  }),
  limits: { fileSize: 1024 * 1024 * 5 },
});
