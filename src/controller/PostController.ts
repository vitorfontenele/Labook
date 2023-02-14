import { Request , Response } from "express";
import { PostBusiness } from "../business/PostBusiness";
import { PostDTO } from "../dtos/PostDTO";
import { BaseError } from "../errors/BaseError";

export class PostController {
    constructor(
        private postBusiness : PostBusiness,
        private postDTO : PostDTO
    ){}

    public getPosts = async (req: Request, res: Response) => {
        try {
            const output = await this.postBusiness.getPosts();

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

    public getPostById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;

            const output = await this.postBusiness.getPostById(id);

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

            const input = this.postDTO.createPostInput(content);
            await this.postBusiness.createPost(input);

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

            const input = this.postDTO.editPostInput(id, content);
            await this.postBusiness.updatePostById(input);

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

            const input = this.postDTO.editPostLikesInput(id, like);
            await this.postBusiness.updatePostLikesById(input);

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

            await this.postBusiness.deletePostById(id);

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