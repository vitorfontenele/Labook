import { PostDatabase } from "../database/PostDatabase";
import { Post } from "../models/Post";
import { PostDB } from "../types";

export class PostBusiness {
    public async getPosts(){
        const postDatabase = new PostDatabase();
        const postsDB : PostDB[] = await postDatabase.findPosts();

        const output = postsDB.map(postDB => new Post (
            postDB.id,
            postDB.creator_id,
            postDB.content,
            postDB.likes,
            postDB.dislikes,
            postDB.created_at,
            postDB.updated_at
        ));

        return output;
    }
}