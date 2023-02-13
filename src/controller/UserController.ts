import { Request , Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import { UserDTO } from "../dtos/UserDTO";
import { BaseError } from "../errors/BaseError"

export class UserController {
    public getUsers = async(req: Request, res: Response) => {
        try {
            const userBusiness = new UserBusiness();
            const output = await userBusiness.getUsers();

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

    public createUser = async(req: Request, res: Response) => {
        try {
            const { name , email , password } = req.body;

            const userDTO = new UserDTO();
            const input = userDTO.createUserInput(name, email, password);

            const userBusiness = new UserBusiness();
            await userBusiness.createUser(input);

            res.status(201).send("Usuário cadastrado com sucesso");
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