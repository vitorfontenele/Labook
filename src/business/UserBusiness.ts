import { UserDatabase } from "../database/UserDatabase";
import { CreateUserInputDTO, CreateUserOutputDTO, GetUserByIdInputDTO, GetUserInputDTO, GetUserOutputDTO, LoginUserInputDTO, LoginUserOutputDTO, UserDTO } from "../dtos/UserDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { User } from "../models/User";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { TokenPayload, USER_ROLES } from "../types";

export class UserBusiness {
    constructor(
        private userDatabase: UserDatabase,
        private userDTO: UserDTO,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private hashManager: HashManager
    ){}

    public async getUsers(input : GetUserInputDTO) : Promise<GetUserOutputDTO[]>{
        const { token } = input;
        const usersDB = await this.userDatabase.findUsers();

        const payload = this.tokenManager.getPayload(token);
        if (payload === null){
            throw new BadRequestError("Token inválido");
        }

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

    public async getUserById(input: GetUserByIdInputDTO) : Promise<GetUserOutputDTO>{ 
        const { token , id } = input;

        const payload = this.tokenManager.getPayload(token);
        if (payload === null){
            throw new BadRequestError("Token inválido");
        }
     
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

        const userDB = await this.userDatabase.findUserByEmail(email);
        if (userDB){
            throw new BadRequestError("Já existe um user com esse 'email'");
        }

        const id = this.idGenerator.generate();
        const createdAt = (new Date()).toISOString();
        const role = USER_ROLES.NORMAL;
        const hashedPassword = await this.hashManager.hash(password);

        const newUser = new User (id, name, email, hashedPassword, role, createdAt);

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

    public async loginUser(input : LoginUserInputDTO) : Promise<LoginUserOutputDTO> {
        const { email , password } = input;

        const userDB = await this.userDatabase.findUserByEmail(email);
        if (!userDB) {
            throw new NotFoundError("'email' não encontrado")
        }

        const isPasswordCorrect = await this.hashManager.compare(password, userDB.password);

        if (!isPasswordCorrect) {
            throw new BadRequestError("'email' ou 'password' incorretos")
        }

        const user = new User(
            userDB.id,
            userDB.name,
            userDB.email,
            userDB.password,
            userDB.role,
            userDB.created_at
        )

        const payload : TokenPayload = {
            id: user.getId(),
            name: user.getName(),
            role: user.getRole()
        }

        const token = this.tokenManager.createToken(payload);

        const output : LoginUserOutputDTO = {
            token
        }

        return output;
    }
}