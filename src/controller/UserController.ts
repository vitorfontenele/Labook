import { Request , Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
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
}