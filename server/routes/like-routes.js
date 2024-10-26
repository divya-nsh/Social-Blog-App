import { Router } from "express";
import { authorizaiton } from "../middleware/auth.js";
import * as c from "../Controllers/Like.controller.js";

// prefix for route is - "api/like"
const router = Router();
// authorizaiton middleware for all routes
router.use(authorizaiton);

router.post("/post/:postId", c.likePost);
router.post("/comment/:commentId", c.likeComment);
router.delete("/post/:postId", c.dislikePost);
router.delete("/comment/:commentId", c.dislikeComment);

export default router;
