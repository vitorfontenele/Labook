import { BadRequestError } from "../errors/BadRequestError";
import { User } from "../models/User";
import { emailRegex, passwordRegex } from "../regex";
import { USER_ROLES } from "../types";

export interface CreateUserInputDTO {
    name: string
    email: string
    password: string
}

export interface CreateUserOutputDTO {
    token: string
}

export interface GetUserInputDTO {
    token: string
}


export interface GetUserOutputDTO {
    id: string
    name: string
    role: USER_ROLES
}

export interface GetUserByIdInputDTO {
    id: string 
    token: string
}

export interface LoginUserInputDTO {
    email: string
    password: string
}

export interface LoginUserOutputDTO {
    token: string
}

export class UserDTO {
    getUserInput(token : unknown){
        if (typeof token !== "string"){
            throw new BadRequestError("Token inválido");
        }

        const result : GetUserInputDTO = {
            token
        }

        return result;
    }

    getUserOutput(user: User) : GetUserOutputDTO {
        const result : GetUserOutputDTO = {
            id: user.getId(),
            name: user.getName(),
            role: user.getRole()
        }

        return result;
    }

    getUserInputById(token: unknown, id: string){
        // id é path param

        if (typeof token !== "string"){
            throw new BadRequestError("Token inválido");
        }

        const result : GetUserByIdInputDTO = {
            id,
            token
        }

        return result;
    }

    createUserInput(name: unknown, email: unknown, password: unknown) : CreateUserInputDTO {
        if (typeof name !== "string"){
            throw new BadRequestError("'name' precisa ser uma string");
        }

        if (name.length < 2){
            throw new BadRequestError("'name' precisa ter no mínimo 2 caracteres");
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

    loginUserInput(email: unknown, password: unknown) : LoginUserInputDTO {
        if (typeof email !== "string"){
            throw new BadRequestError("'email' deve ser string");
        }

        if (typeof password !== "string"){
            throw new BadRequestError("'password' deve ser string");
        }

        const result : LoginUserInputDTO = {
            email,
            password
        }

        return result;
    }

    loginUserOutput(token : string) : LoginUserOutputDTO{
        const result : LoginUserOutputDTO = {
            token
        }

        return result;
    }
}