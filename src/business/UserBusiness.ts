import { UserDatabase } from "../database/UserDatabase";
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
}