import { UserDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
    public static TABLE_USERS = "users";
    
    public async findUsers(){
        const usersDB : UserDB[] = await BaseDatabase
            .connection(UserDatabase.TABLE_USERS);

        return usersDB;
    }

    public async findUserById(id : string){
        const [ result ] : UserDB[] | undefined[] = await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .where({ id });
        return result;
    }

    public async createUser(newUserDB : UserDB){
        await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .insert(newUserDB);
    }
}