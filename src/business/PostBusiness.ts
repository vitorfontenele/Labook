import { PostDatabase } from "../database/PostDatabase";
import { UserDatabase } from "../database/UserDatabase";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
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

    public async createPost(input : any){
        const { content } = input;
        const postDatabase = new PostDatabase();

        if (typeof content !== "string"){
            throw new BadRequestError("'content' deve ser uma string");
        }

        const id = ((new Date()).getTime()).toString();
        const createdAt = (new Date()).toISOString();

        const newPost = new Post (
            id,
            content,
            0,
            0,
            createdAt,
            createdAt,
            {
                id: "u001",
                name: "John Titor"
            }
        )

        const newPostDB : PostDB = {
            id: newPost.getId(),
            creator_id: newPost.getCreator().id,
            content: newPost.getContent(),
            likes: newPost.getLikes(),
            dislikes: newPost.getDislikes(),
            created_at: newPost.getCreatedAt(),
            updated_at: newPost.getUpdatedAt()
        }

        await postDatabase.createPost(newPostDB);
    }

    public async updatePostById(input : any, id : string){
        const { content } = input;
        const postDatabase = new PostDatabase();

        const postDB = await postDatabase.findPostById(id);
        if (!postDB){
            throw new NotFoundError("Não foi encontrado um post com esse id");
        }

        if (typeof content !== "string"){
            throw new BadRequestError("'content' deve ser uma string");
        }

        postDB["content"] = content;

        await postDatabase.updatePostById(postDB, id);
    }

    public async updatePostLikesById(input : any, id : string){
        const updatedLike = input.like;
        const postDatabase = new PostDatabase();

        const postDB = await postDatabase.findPostById(id);
        if (!postDB){
            throw new NotFoundError("Não foi encontrado um post com esse id");
        }

        if (typeof updatedLike !== "boolean"){
            throw new BadRequestError("'like' deve ser um boolean");
        }

        // const currentLikes = postDB.likes;
        // const currentDislikes = postDB.dislikes;
        // if (likes)
    }

    public async deletePostById(id : string){
        const postDatabase = new PostDatabase();
        const postDB = await postDatabase.findPostById(id);

        if (!postDB){
            throw new NotFoundError("Não existe um post com esse 'id'");
        }

        await postDatabase.deletePostById(id);
    }
}