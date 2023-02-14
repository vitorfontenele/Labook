import { UserDatabase } from "../database/UserDatabase";
import { CreateUserInputDTO, GetUserOutputDTO, UserDTO } from "../dtos/UserDTO";
import { NotFoundError } from "../errors/NotFoundError";
import { User } from "../models/User";

export class UserBusiness {
    constructor(
        private userDatabase: UserDatabase,
        private userDTO: UserDTO
    ){}

    public async getUsers() : Promise<GetUserOutputDTO[]>{
        const usersDB = await this.userDatabase.findUsers();

        const output = usersDB.map(userDB => {
            const user = new User(
                userDB.id,
                userDB.name,
                userDB.email,
                userDB.password,
                userDB.role,
                userDB.created_at)

            return this.userDTO.getUserOutput(user)
        });

        return output;
    }

    public async getUserById(id : string) : Promise<GetUserOutputDTO>{    
        const userDB = await this.userDatabase.findUserById(id);
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

        const output = this.userDTO.getUserOutput(user);

        return output;
    }

    public async createUser(input : CreateUserInputDTO) : Promise<void>{
        const { name , email , password } = input;

        const id = ((new Date()).getTime()).toString();
        const createdAt = (new Date()).toISOString();
        const role = "author"; // dado mockado, manter?

        const newUser = new User (id, name, email, password, role, createdAt);

        const newUserDB = newUser.toDBModel();
        await this.userDatabase.createUser(newUserDB);
    }
}