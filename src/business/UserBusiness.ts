import { UserDatabase } from "../database/UserDatabase";
import { CreateUserInputDTO, GetUserOutputDTO, UserDTO } from "../dtos/UserDTO";
import { NotFoundError } from "../errors/NotFoundError";
import { User } from "../models/User";

export class UserBusiness {
    public async getUsers() : Promise<GetUserOutputDTO[]>{
        const userDatabase = new UserDatabase();
        const usersDB = await userDatabase.findUsers();
        const userDTO = new UserDTO();

        const output = usersDB.map(userDB => {
            const user = new User(
                userDB.id,
                userDB.name,
                userDB.email,
                userDB.password,
                userDB.role,
                userDB.created_at)

            return userDTO.getUserOutput(user)
        });

        return output;
    }

    public async getUserById(id : string) : Promise<GetUserOutputDTO>{
        const userDatabase  = new UserDatabase();
        
        const userDB = await userDatabase.findUserById(id);
        if (!userDB){
            throw new NotFoundError("Não foi encontrado um user com esse 'id'");
        }

        const user = new User(
            userDB.id,
            userDB.name,
            userDB.email,
            userDB.password,
            userDB.role,
            userDB.created_at
        );

        const userDTO = new UserDTO();
        const output = userDTO.getUserOutput(user);

        return output;
    }

    public async createUser(input : CreateUserInputDTO) : Promise<void>{
        const { name , email , password } = input;

        const userDatabase = new UserDatabase();
        
        const id = ((new Date()).getTime()).toString();
        const createdAt = (new Date()).toISOString();
        const role = "author"; // dado mockado, manter?

        const newUser = new User (id, name, email, password, role, createdAt);

        const newUserDB = newUser.toDBModel();
        await userDatabase.createUser(newUserDB);
    }
}