import { Request , Response } from "express";
import { PostBusiness } from "../business/PostBusiness";
import { BaseError } from "../errors/BaseError";

export class PostController {
    public getPosts = async (req: Request, res: Response) => {
        try {
            const postBusiness = new PostBusiness();
            const output = await postBusiness.getPosts();

            res.status(200).send(output);
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }
}