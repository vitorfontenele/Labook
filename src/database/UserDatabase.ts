import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
    public static TABLE_USERS = "users";
    
    public async findUsers(){
        const usersDB = await BaseDatabase
            .connection(UserDatabase.TABLE_USERS);

        return usersDB;
    }

    public async findUserById(id : string){
        const [ result ] = await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .where({ id });
        return result;
    }
}