import { BadRequestError } from "../errors/BadRequestError";
import { Post } from "../models/Post";
import { PostDB } from "../types";

export interface CreatePostInputDTO {
    content : string
}

export interface EditPostInputDTO {
    id : string
    content : string
}

export interface EditPostLikesInputDTO {
    id : string
    like : boolean
}

export class PostDTO {
    getPostOutput = (post: Post) : PostDB => {
        const result : PostDB = {
            id: post.getId(),
            creator_id: post.getCreator().id,
            content: post.getContent(),
            likes: post.getLikes(),
            dislikes: post.getDislikes(),
            created_at: post.getCreatedAt(),
            updated_at: post.getCreatedAt()
        }
        
        return result;
    }

    createPostInput = (content: unknown) : CreatePostInputDTO => {
        if (typeof content !== "string"){
            throw new BadRequestError("'content' deve ser uma string");
        }

        const result : CreatePostInputDTO = {
            content
        }

        return result;
    }

    editPostInput = (id : string, content : unknown) : EditPostInputDTO => {
        // id é string pois path param
        
        if (typeof content !== "string"){
            throw new BadRequestError("'content' deve ser uma string");
        }

        const result : EditPostInputDTO = {
            id,
            content
        }

        return result;
    }

    editPostLikesInput = (id : string, like : unknown) : EditPostLikesInputDTO => {
        // id é string pois path param
        
        if (typeof like !== "boolean"){
            throw new BadRequestError("'like' deve ser um boolean");
        }

        const result : EditPostLikesInputDTO = {
            id,
            like
        }

        return result;
    }
}