import { Router } from "express";
import * as c from "../Controllers/bookmarks.controller.js";
import { authorizaiton } from "../middleware/auth.js";

// prefix for route is - "api/bookmarks"
const router = Router();
// authorizaiton middleware for all routes
router.use(authorizaiton);

router.get("/", c.getBookmarkPosts);
router.route("/:postId").post(c.createBookmark).delete(c.removeBookmark);
router.get("/count", c.getBookmarkCount);

export default router;
