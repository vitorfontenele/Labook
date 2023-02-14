import express from "express";
import { PostBusiness } from "../business/PostBusiness";
import { PostController } from "../controller/PostController";
import { LikesDislikesDatabase } from "../database/LikesDislikesDatabase";
import { PostDatabase } from "../database/PostDatabase";
import { UserDatabase } from "../database/UserDatabase";
import { PostDTO } from "../dtos/PostDTO";

const postController = new PostController(
    new PostBusiness(
        new PostDatabase(),
        new UserDatabase(),
        new LikesDislikesDatabase(),
        new PostDTO()
    ),
    new PostDTO()
);

export const postRouter = express.Router();

postRouter.get("/", postController.getPosts);
postRouter.get("/:id", postController.getPostById);
postRouter.post("/", postController.createPost);
postRouter.put("/:id", postController.updatePostById);
postRouter.put("/:id/like", postController.updatePostLikesById);
postRouter.delete("/:id", postController.deletePostById);