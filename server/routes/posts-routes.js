import { Router } from "express";
import { authorizaiton, passUserId } from "../middleware/auth.js";
import * as c from "../Controllers/post.controller.js";
import { postImgUploader } from "../middleware/imageUploaders.js";

//Route Prefix is "api/posts"
const router = Router();

//login is not required in route with passUserId middleware,will give like status if session valid

router.get("/", passUserId, c.getPosts);
router.post("/", postImgUploader.single("image"), authorizaiton, c.createPost);

router.get("/search/:text", passUserId, c.searchPost);

router.get("/slug/:slug", passUserId, c.getPostBySlug);

router.get("/:postId", passUserId, c.getSinglePost);

router.put(
  "/:postId",
  postImgUploader.single("image"),
  authorizaiton,
  c.updatedPost
);

router.delete("/:postId", authorizaiton, c.deletePost);

export default router;

//BASEURL={domain}/api/posts
// GET POST =            GET {BASEURL}/?cursor="?"&user="?"&tag="?"&select="?"
// GET SINGLE POST =     GET {BASEURL}/:postId
// GET POST BY SLUG =    POST {BASEURL}/slug
// SEARCH POST =         GET {BASERURL}/:SEARHQUERY?cursor="?"
// CREATE POST =         POST {BASEURL}/
// UPDATE POST =         PUT {BASEURL}/:postId
// DELETE POST =         DELETE {BASEURL}/:postId
