import { BadRequestError } from "../errors/BadRequestError";

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