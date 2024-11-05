import { Router } from "express";
import { authorizaiton, passUserId } from "../middleware/auth.js";
import * as c from "../Controllers/user.controller.js";
import { userImgUploader } from "../middleware/imageUploaders.js";
const router = Router();

router.post("/signup", c.createUser);
router.post("/login", c.handleLogin);
router.patch("/change-password/me", authorizaiton, c.updatePassword);
router.get("/me", authorizaiton, c.getUser);
router.post("/forgot-password", c.forgotPassword);
router.post("/reset-password", c.resetPassword);

router.get("/:username", passUserId, c.getUserByUsername);
router.get("/:searchText/search", passUserId, c.searchUser);

router.put(
  "/me",
  userImgUploader.single("image"),
  authorizaiton,
  c.updateProfile
);

export default router;
