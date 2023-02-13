import { UserDatabase } from "../database/UserDatabase";
import { CreateUserInputDTO } from "../dtos/UserDTO";
import { User } from "../models/User";

export class UserBusiness {
    public async getUsers(){
        const userDatabase = new UserDatabase();
        const usersDB = await userDatabase.findUsers();

        const output = usersDB.map(userDB => new User(
            userDB.id,
            userDB.name,
            userDB.email,
            userDB.password,
            userDB.role,
            userDB.created_at
        ));

        return output;
    }

    public async createUser(input : CreateUserInputDTO){
        const { name , email , password } = input;

        const userDatabase = new UserDatabase();
        
        const id = ((new Date()).getTime()).toString();
        const createdAt = (new Date()).toISOString();
        const role = "author";

        const newUser = new User (id, name, email, password,role, createdAt);

        // const newUserDB : UserDB = {
            
        // }

        // await userDatabase.createUser(newUserDB);
    }
}