import { UserDatabase } from "../database/UserDatabase";
import { CreateUserInputDTO } from "../dtos/UserDTO";
import { NotFoundError } from "../errors/NotFoundError";
import { User } from "../models/User";
import { UserDB } from "../types";

export class UserBusiness {
    public async getUsers(){
        const userDatabase = new UserDatabase();
        const usersDB = await userDatabase.findUsers();

        const output = usersDB.map(userDB => new User(
            userDB.id,
            userDB.name,
            userDB.email
        ));

        return output;
    }

    public async getUserById(id : string){
        const userDatabase  = new UserDatabase();
        
        const userDB = await userDatabase.findUserById(id);
        if (!userDB){
            throw new NotFoundError("Não foi encontrado um user com esse 'id'");
        }

        const output = new User(
            userDB.id,
            userDB.name,
            userDB.email,
        )

        return output;
    }

    public async createUser(input : CreateUserInputDTO){
        const { name , email , password } = input;

        const userDatabase = new UserDatabase();
        
        const id = ((new Date()).getTime()).toString();
        const createdAt = (new Date()).toISOString();
        const role = "author";

        const newUser = new User (id, name, email, password,role, createdAt);

        const newUserDB : UserDB = {
            id: newUser.getId(),
            name: newUser.getName(),
            email: newUser.getEmail(),
            password: newUser.getPassword() as string,
            role: newUser.getRole() as string,
            created_at: newUser.getCreatedAt() as string
        };

        await userDatabase.createUser(newUserDB);
    }
}