import { UserDatabase } from "../database/UserDatabase";
import { CreateUserInputDTO, CreateUserOutputDTO, GetUserOutputDTO, UserDTO } from "../dtos/UserDTO";
import { NotFoundError } from "../errors/NotFoundError";
import { User } from "../models/User";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { TokenPayload, USER_ROLES } from "../types";

export class UserBusiness {
    constructor(
        private userDatabase: UserDatabase,
        private userDTO: UserDTO,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
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

    public async createUser(input : CreateUserInputDTO) : Promise<CreateUserOutputDTO>{
        const { name , email , password } = input;

        const id = this.idGenerator.generate();
        const createdAt = (new Date()).toISOString();
        const role = USER_ROLES.NORMAL;

        const newUser = new User (id, name, email, password, role, createdAt);

        const tokenPayload : TokenPayload = {
            id: newUser.getId(),
            name: newUser.getName(),
            role: newUser.getRole()
        }

        const token = this.tokenManager.createToken(tokenPayload);

        const newUserDB = newUser.toDBModel();
        await this.userDatabase.createUser(newUserDB);

        const output = this.userDTO.createUserOutput(token)

        return output;
    }
}