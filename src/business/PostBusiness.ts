import { LikesDislikesDatabase } from "../database/LikesDislikesDatabase";
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
        postDB["updated_at"] = (new Date()).toISOString();

        await postDatabase.updatePostById(postDB, id);
    }

    public async updatePostLikesById(input : any, id : string){
        // Dado mockado
        const userId = "u003";

        const updatedLike = input.like;
        const postDatabase = new PostDatabase();

        const postDB = await postDatabase.findPostById(id);
        if (!postDB){
            throw new NotFoundError("Não foi encontrado um post com esse id");
        }

        if (typeof updatedLike !== "boolean"){
            throw new BadRequestError("'like' deve ser um boolean");
        }

        const likesDislikesDatabase = new LikesDislikesDatabase();
        const likesDislikesDB = await likesDislikesDatabase.findLikeByUserAndPostId(userId, postDB.id);
        if (!likesDislikesDB){
            // Caso nao exista nem like nem dislike do user no post
            if (updatedLike){
                // caso seja dado o like
                await likesDislikesDatabase.createLike({
                    user_id: userId,
                    post_id: postDB.id,
                    like: 1
                })

                // +1 like
                postDB.likes += 1;
                await postDatabase.updatePostById(postDB, postDB.id);
            } else {
                // caso seja dado dislike
                await likesDislikesDatabase.createLike({
                    user_id: userId,
                    post_id: postDB.id,
                    like: 0
                })
                // +1 dislike
                postDB.dislikes += 1;
                await postDatabase.updatePostById(postDB, postDB.id);
            }
        } else {
            // Caso já exista um like ou dislike do user no post
            const like = likesDislikesDB.like;
            // Usuário dá like num post que já havia dado like
            // ou dá dislike num post que já havia dado dislike
            if ((updatedLike && like)){
                await likesDislikesDatabase.deleteLikeByUserAndPostId(userId, postDB.id);
                if (updatedLike){
                    // -1 like
                    postDB.likes -= 1;
                    await postDatabase.updatePostById(postDB, postDB.id);
                } else {
                    // -1 dislike
                    postDB.dislikes -= 1;
                    await postDatabase.updatePostById(postDB, postDB.id);
                }
            } else {
                const newLike = like === 0 ? 1 : 0;
                await likesDislikesDatabase.updateLikeByUserAndPostId(
                    {
                        user_id: userId,
                        post_id: postDB.id,
                        like: newLike
                    },
                    userId,
                    postDB.id
                )

                if (newLike){
                    postDB.likes += 1;
                    postDB.dislikes -= 1;
                } else {
                    postDB.likes -= 1;
                    postDB.dislikes += 1;
                }

                await postDatabase.updatePostById(postDB, postDB.id);
            }
        }
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