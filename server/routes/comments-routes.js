import { Router } from "express";
import { authorizaiton, passUserId } from "../middleware/auth.js";
import * as c from "../Controllers/comments.controller.js";

// prefix for route is - "api/comments"
const router = Router();

router.get("/:postId", passUserId, c.getComments);
router.post("/:postId", authorizaiton, c.createComment);
router.delete("/:commentId", authorizaiton, c.deleteComment);
router.put("/:commentId", authorizaiton, c.updateComment);

export default router;
