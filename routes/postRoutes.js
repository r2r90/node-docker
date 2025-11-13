import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import * as postController from "../controllers/postController.js";

const router = express.Router();

//localhost:3000
router
  .route("/")
  .get(protect, postController.getAllPosts)
  .post(protect, postController.createPost);

router
  .route("/:id")
  .get(protect, postController.getOnePost)
  .patch(protect, postController.updatePost)
  .delete(protect, postController.deletePost);

export default router;
