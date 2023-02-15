import { BadRequestError } from "../errors/BadRequestError";
import { Post } from "../models/Post";

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

export interface GetPostInputDTO {
    token: string
}

export interface GetPostOutputDTO {
    id : string
    content : string
    likes: number
    dislikes: number
    createdAt: string
    updatedAt: string
    creator: {
        id: string,
        name: string
    }
}

export interface GetPostByIdInputDTO {
    id: string
    token: string
}

export class PostDTO {
    getPostInput = (token: unknown) : GetPostInputDTO => {
        if (typeof token !== "string"){
            throw new BadRequestError ("Token inválido");
        }

        const result : GetPostInputDTO = {
            token
        }

        return result;
    }

    getPostOutput = (post: Post) : GetPostOutputDTO => {
        const result : GetPostOutputDTO = {
            id: post.getId(),
            content: post.getContent(),
            likes: post.getLikes(),
            dislikes: post.getDislikes(),
            createdAt: post.getCreatedAt(),
            updatedAt: post.getCreatedAt(),
            creator: post.getCreator()
        }
        
        return result;
    }

    getPostByIdInput = (token: unknown, id: string) : GetPostByIdInputDTO => {
        // id é path param
        
        if (typeof token !== "string"){
            throw new BadRequestError ("Token inválido");
        }

        const result : GetPostByIdInputDTO = {
            id,
            token
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