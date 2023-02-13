import { UserDatabase } from "../database/UserDatabase";

export class UserBusiness {
    public async getUsers(){
        const userDatabase = new UserDatabase();
        const usersDB = await userDatabase.findUsers();
    }
}