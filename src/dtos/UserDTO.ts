import { BadRequestError } from "../errors/BadRequestError";

export interface CreateUserInputDTO {
    name : string
    email : string
    password : string
} 

export class UserDTO {
    createUserInput(name: unknown, email: unknown, password: unknown) : CreateUserInputDTO {
        if (typeof name !== "string"){
            throw new BadRequestError("'name' precisa ser uma string");
        }

        if (typeof email !== "string"){
            throw new BadRequestError("'email' precisa ser uma string");
        }

        if (typeof password !== "string"){
            throw new BadRequestError("'password' precisa ser uma string");
        }

        const result : CreateUserInputDTO = {
            name,
            email,
            password
        }

        return result;
    }
}