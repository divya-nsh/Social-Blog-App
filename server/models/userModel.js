import { Schema, model } from "mongoose";
import isEmail from "validator/lib/isEmail.js";
import isURL from "validator/lib/isURL.js";
import bcrypt from "bcrypt";

const usernameValidator = [
  {
    validator: (val) => val.length >= 3 && val.length <= 30,
    message: "Username must be between 3 and 30 characters",
  },
  {
    validator: (val) => /^[a-zA-Z0-9_]+$/.test(val),
    message: "Username can only contain letters, number and underscores",
  },
];

const ImageSchema = new Schema(
  {
    url: {
      type: String,
      default: "https://via.placeholder.com/20",
      maxLength: 2000,
    },
    publicId: {
      type: String,
      maxLength: 200,
    },
  },
  { _id: false, minimize: false }
);

export const allowedSocialLinks = new Set([
  "website",
  "facebook",
  "linkedin",
  "twitter",
  "instagram",
  "youtube",
  "github",
]);

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: usernameValidator,
      default: function () {
        return generateUsername(this.fullName);
      },
    },
    email: {
      type: String,
      required: true,
      maxlength: 64,
      unique: true,
      trim: true,
      validate: [isEmail, "Invalid Email!"],
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: [8, "Password must be 8 character long"],
      maxlength: [64, "Password must not more than 64 characters"],
    },
    pv: { type: Number, default: Date.now(), required: true },
    image: { type: ImageSchema, default: {} },
    bio: { type: String, trim: true, maxlength: 200, default: "" },
    isVerified: Boolean,
    socialLinks: {
      type: Map,
      of: {
        type: String,
        validate: [
          (url) =>
            url === "" ||
            isURL(url, {
              protocols: ["http", "https"],
              require_protocol: true,
            }),
          "Invalid URL",
        ],
        maxLength: [150, "URL must be less than or equal to 150 characters"],
      },

      validate: [
        {
          validator: (map) => {
            for (let key of map.keys()) {
              if (!allowedSocialLinks.has(key)) return false;
            }
            return true;
          },

          message: "Invalid keys",
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("findOneAndUpdate", async function (next) {
  this.getOptions().runValidators = true;
  this.getOptions().new = true;
  const update = this.getUpdate();
  if (update.password && update.password.length >= 8) {
    update.password = await bcrypt.hash(update.password, 10);
    update.pv = Date.now();
  }
  next();
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password.length >= 8) {
    this.password = bcrypt.hashSync(this.password, 10);
    this.pv = Date.now();
  }
  next();
});

export const User = model("User", userSchema);

function generateUsername(preffix) {
  const baseName = preffix
    ?.split(" ")[0]
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "") // Remove invalid characters
    .slice(0, 10); // Limit to 10 chars

  // Generate a time-based suffix using Date.now() converted to base36
  const timeSuffix = Date.now().toString(36); // 8 chars

  return (baseName + timeSuffix).slice(0, 30); // Ensure max 30 chars
}
