export class User {
    // password, role e createdAt opcionais
    // Esses dados nao precisam ser mostrados nas requisicoes GET
    constructor(
        private id : string,
        private name : string,
        private email : string,
        private password? : string,
        private role? : string,
        private createdAt? : string
    ){}

    public getId() : string {
        return this.id;
    }

    public setId(value : string) : void {
        this.id = value;
    }

    public getName() : string {
        return this.name;
    }

    public setName(value : string) : void {
        this.name = value;
    }

    public getEmail() : string {
        return this.email;
    }

    public setEmail(value : string) : void {
        this.email = value;
    }

    public getPassword() : string | undefined {
        return this.password;
    }

    public setPassword(value : string) : void {
        this.password = value;
    }

    public getRole() : string | undefined {
        return this.role;
    }

    public setRole(value : string) : void {
        this.role = value;
    }

    public getCreatedAt() : string | undefined {
        return this.createdAt;
    }

    public setCreatedAt(value : string) : void {
        this.createdAt = value;
    }
}