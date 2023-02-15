import { BadRequestError } from "../errors/BadRequestError";
import { User } from "../models/User";
import { emailRegex, passwordRegex } from "../regex";

export interface CreateUserInputDTO {
    name: string
    email: string
    password: string
}

export interface CreateUserOutputDTO {
    token: string
}

export interface GetUserOutputDTO {
    id: string
    name: string
    email: string
}

export class UserDTO {
    getUserOutput(user: User) : GetUserOutputDTO {
        const result : GetUserOutputDTO = {
            id: user.getId(),
            name: user.getName(),
            email: user.getEmail()
        }

        return result;
    }

    createUserInput(name: unknown, email: unknown, password: unknown) : CreateUserInputDTO {
        if (typeof name !== "string"){
            throw new BadRequestError("'name' precisa ser uma string");
        }

        if (typeof email !== "string"){
            throw new BadRequestError("'email' precisa ser uma string");
        }

        if (!emailRegex.test(email)){
            throw new BadRequestError("'email' não está no formato adequado");
        }

        if (typeof password !== "string"){
            throw new BadRequestError("'password' precisa ser uma string");
        }

        if (!passwordRegex.test(password)){
            throw new BadRequestError("'password' deve ter entre 4 e 8 caracteres e no mínimo um número");
        }

        const result : CreateUserInputDTO = {
            name,
            email,
            password
        }

        return result;
    }

    createUserOutput(token : string) : CreateUserOutputDTO {
        const result : CreateUserOutputDTO = {
            token
        }

        return result;
    }
}