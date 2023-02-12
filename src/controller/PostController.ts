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

    public createPost = async (req: Request, res: Response) => {
        try {
            const content = req.body.content;

            const input = {
                content
            };

            const postBusiness = new PostBusiness();
            await postBusiness.createPost(input);

            res.status(201).send("Post criado com sucesso");
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public updatePostById = async(req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const content = req.body.content;

            const input = {
                content
            }

            const postBusiness = new PostBusiness();
            await postBusiness.updatePostById(input, id);

            res.status(200).send("Post atualizado com sucesso");
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public updatePostLikesById = async(req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const like = req.body.like;

            const input = {
                like
            }

            const postBusiness = new PostBusiness();
            await postBusiness.updatePostLikesById(input, id);

            res.status(200).send("Like atualizado com sucesso");
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public deletePostById = async(req: Request, res: Response) => {
        try {
            const id = req.params.id;

            const postBusiness = new PostBusiness();
            await postBusiness.deletePostById(id);

            res.status(200).send("Post deletado com sucesso");
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