import { v2 as cloudinary } from "cloudinary";
import { MulterError } from "multer";
import { removeImg } from "./cloudinary-service.js";

/**
 * @param {import("cloudinary").UploadApiOptions} options
 * @returns {import("multer").StorageEngine}
 */
export function cloudinaryStorage(options) {
  return {
    async _handleFile(req, file, cb) {
      const uploadStream = cloudinary.uploader.upload_stream(
        { chunk_size: 500 * 1080, ...options },
        (err, result) => {
          if (err) {
            console.log(
              "Cloudinary storage _hanlde File Error occur",
              err.message,
              err.name,
              err.http_code
            );
            if (err.http_code === 400) {
              cb(err.message);
            } else {
              cb("Something went's wrong while uploading image");
            }
          } else {
            cb(null, {
              path: result?.secure_url,
              size: result?.bytes,
              filename: result?.public_id,
              originalname: result?.original_filename,
              destination: "Cloudinary",
              fieldname: file.fieldname,
              mimetype: file.mimetype,
              ...result,
            });
          }
        }
      );
      file.stream.pipe(uploadStream);
    },
    _removeFile(req, file, callback) {
      removeImg(file.filename, true);
      callback();
    },
  };
}

export function fileFilterWithMimeType(allowedMimeType) {
  return (req, file, cb) => {
    if (!allowedMimeType.includes(file.mimetype)) {
      cb(new MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
    } else {
      cb(null, true);
    }
  };
}
