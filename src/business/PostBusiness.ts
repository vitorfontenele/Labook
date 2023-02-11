import { PostDatabase } from "../database/PostDatabase";
import { UserDatabase } from "../database/UserDatabase";
import { Post } from "../models/Post";
import { PostDB, UserDB } from "../types";

export class PostBusiness {
    public async getPosts(){
        const postDatabase = new PostDatabase();
        const postsDB = await postDatabase.findPosts();

        const userDatabase = new UserDatabase();
        const usersDB = await userDatabase.findUsers();

        const output = postsDB.map(postDB => new Post (
            postDB.id,
            postDB.content,
            postDB.likes,
            postDB.dislikes,
            postDB.created_at,
            postDB.updated_at,
            getCreator(postDB.creator_id)
        ));

        function getCreator(userId : string){
            const user = usersDB.find(userDB => userDB.id === userId) as UserDB;
            
            return {
                id: user.id,
                name: user.name
            }
        }

        return output;
    }
}