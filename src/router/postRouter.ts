import express from "express";
import { PostController } from "../controller/PostController";

const postController = new PostController();

export const postRouter = express.Router();

postRouter.get("/", postController.getPosts);
postRouter.post("/", postController.createPost);
postRouter.put("/:id", postController.updatePostById);
postRouter.delete("/:id", postController.deletePostById);