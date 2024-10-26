import { Schema, model } from "mongoose";
import isEmail from "validator/lib/isEmail.js";
import isURL from "validator/lib/isURL.js";
import bcrypt from "bcrypt";

const usernameValidator = [
  {
    validator: (val) => val.length >= 2 && val.length <= 30,
    message: "Username must be between 2 and 30 characters",
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
      maxlength: 30,
      default: function () {
        // 10 + 8 = 18  (babluedonirdjdfddd)(babluedoni.rdjdfddd)
        return (
          this.fullName?.split(" ")[0].toLocaleLowerCase().slice(0, 10) +
          Date.now().toString(36)
        );
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
      type: {
        website: {
          type: String,
          maxLength: 100,
          trim: true,
          validate: [isURL, "Invalid Website Link"],
        },
        facebook: {
          type: String,
          maxLength: 100,
          trim: true,
          validate: [isURL, "Invalid facebook Link"],
        },
        linkedin: {
          type: String,
          maxLength: 100,
          trim: true,
          validate: [isURL, "Invalid linkedin Link"],
        },
        twitter: {
          type: String,
          maxLength: 100,
          trim: true,
          validate: [isURL, "Invalid twitter Link"],
        },
        instagram: {
          type: String,
          maxLength: 100,
          trim: true,
          validate: [isURL, "Invalid instagram Link"],
        },
        youtube: {
          type: String,
          maxLength: 100,
          trim: true,
          validate: [isURL, "Invalid youtube Link"],
        },
        github: {
          type: String,
          maxLength: 100,
          trim: true,
          validate: [isURL, "Invalid github Link"],
        },
      },
      _id: false,
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
