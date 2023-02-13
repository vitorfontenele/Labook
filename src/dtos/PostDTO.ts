import { BadRequestError } from "../errors/BadRequestError";

export interface CreatePostInputDTO {
    content : string
}

export class PostDTO {
    createPostInput = (content: unknown) => {
        if (typeof content !== "string"){
            throw new BadRequestError("'content' deve ser uma string");
        }

        const result : CreatePostInputDTO = {
            content
        }

        return result;
    }
}