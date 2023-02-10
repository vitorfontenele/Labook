import { BaseDatabase } from "./BaseDatabase";

export class PostDatabase extends BaseDatabase {
    public static TABLE_POSTS = "posts";

    public async findPosts(){
        const result = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS);
        return result;
    }

    public async createPost(newPostDB){
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .insert(newPostDB);
    }

    public async updatePostById(updatedPostDB, id : string){
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .update(updatedPostDB)
            .where({ id })
    }

    public async deletePostById(id : string){
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .del()
            .where({ id });
    }
}