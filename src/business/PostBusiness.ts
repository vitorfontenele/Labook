import { LikesDislikesDatabase } from "../database/LikesDislikesDatabase";
import { PostDatabase } from "../database/PostDatabase";
import { UserDatabase } from "../database/UserDatabase";
import { CreatePostInputDTO, EditPostInputDTO, EditPostLikesInputDTO, GetPostOutputDTO, PostDTO } from "../dtos/PostDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { LikesDislikes } from "../models/LikesDislikes";
import { Post } from "../models/Post";
import { LikesDislikesDB, UserDB } from "../types";

export class PostBusiness {
    constructor(
        private postDatabase : PostDatabase,
        private userDatabase : UserDatabase,
        private likesDislikesDatabase : LikesDislikesDatabase,
        private postDTO : PostDTO
    ){}

    public async getPosts() : Promise<GetPostOutputDTO[]>{
        const postDatabase = new PostDatabase();
        const postsDB = await postDatabase.findPosts();

        const userDatabase = new UserDatabase();
        const usersDB = await userDatabase.findUsers();

        const postDTO = new PostDTO();

        const output = postsDB.map(postDB => {
            const post = new Post (
                postDB.id,
                postDB.content,
                postDB.likes,
                postDB.dislikes,
                postDB.created_at,
                postDB.updated_at,
                getCreator(postDB.creator_id)
            );

            return postDTO.getPostOutput(post);
        })             

        function getCreator(userId : string){
            const user = usersDB.find(userDB => userDB.id === userId) as UserDB;

            return {
                id: user.id,
                name: user.name
            }
        }

        return output;
    }

    public async getPostById(id : string) : Promise<GetPostOutputDTO>{
        const postDatabase = new PostDatabase();
        const userDatabase = new UserDatabase();

        const postDB = await postDatabase.findPostById(id);
        if (!postDB){
            throw new NotFoundError("Não foi encontrado um post com esse 'id'");
        }

        const userId = postDB.creator_id;
        const userDB = await userDatabase.findUserById(userId);
        const userName = userDB?.name;

        const post = new Post(
            postDB.id,
            postDB.content,
            postDB.likes,
            postDB.dislikes,
            postDB.created_at,
            postDB.updated_at,
            { 
              id: userId, 
              name: userName as string
            }
        )

        const postDTO = new PostDTO();
        const output = postDTO.getPostOutput(post);

        return output;
    }

    public async createPost(input : CreatePostInputDTO) : Promise<void>{
        const { content } = input;
        const postDatabase = new PostDatabase();

        const id = ((new Date()).getTime()).toString();
        const createdAt = (new Date()).toISOString();
        const likes = 0;
        const dislikes = 0;

        const newPost = new Post (
            id,
            content,
            likes,
            dislikes,
            createdAt,
            createdAt,
            {
                id: "u001",
                name: "John Titor"
            }
        )

        const newPostDB = newPost.toDBModel();
        await postDatabase.createPost(newPostDB);
    }

    public async updatePostById(input : EditPostInputDTO) : Promise<void>{
        const { content , id } = input;
        const postDatabase = new PostDatabase();

        const postDB = await postDatabase.findPostById(id);
        if (!postDB){
            throw new NotFoundError("Não foi encontrado um post com esse id");
        }

        const updatedAt = (new Date()).toISOString();

        const updatedPost = new Post(
            id,
            content,
            postDB.likes,
            postDB.dislikes,
            postDB.created_at,
            updatedAt,
            {
                id: postDB.creator_id,
                name: "" // não fará diferença
            }
        )

        const updatedPostDB = updatedPost.toDBModel();
        await postDatabase.updatePostById(updatedPostDB, id);
    }

    public async updatePostLikesById(input : EditPostLikesInputDTO) : Promise<void>{
        // Dado mockado
        const userId = "u003";

        const { id } = input;
        const updatedLike = input.like;
        const postDatabase = new PostDatabase();

        const postDB = await postDatabase.findPostById(id);
        if (!postDB){
            throw new NotFoundError("Não foi encontrado um post com esse id");
        }

        const postId = postDB.id as string;

        if (postDB.creator_id === userId){
            throw new BadRequestError("Usuário não pode dar dislike/like no próprio post");
        }

        const likesDislikesDatabase = new LikesDislikesDatabase();
        const likesDislikesDB = await likesDislikesDatabase.findLikeByUserAndPostId(userId, postDB.id);

        let deltaLikes = 0;
        let deltaDislikes = 0;

        if (!likesDislikesDB){
            // Caso nao exista nem like nem dislike do user no post
            const newLikesDislikes = new LikesDislikes(userId, postId);

            if (updatedLike){
                // caso seja dado o like
                newLikesDislikes.setLike(1);
                deltaLikes = 1;
            } else {
                // caso seja dado dislike
                newLikesDislikes.setLike(0);
                deltaDislikes = 1;
            }

            const newLikesDislikesDB : LikesDislikesDB = {
                user_id : newLikesDislikes.getUserId(),
                post_id : newLikesDislikes.getPostId(),
                like : newLikesDislikes.getLike()
            }

            await likesDislikesDatabase.createLike(newLikesDislikesDB);
        } else {
            // Caso já exista um like ou dislike do user no post
            const like = likesDislikesDB.like;

            if ((updatedLike === Boolean(like))){
                // Usuário dá like num post que já havia dado like
                // ou dá dislike num post que já havia dado dislike
                await likesDislikesDatabase.deleteLikeByUserAndPostId(userId, postId);

                if (updatedLike){
                    // -1 like
                    deltaLikes = -1;
                } else {
                    // -1 dislike
                    deltaDislikes = -1;
                }

            } else {
                // Usuário dá like num post que já havia dado dislike
                // ou dá dislike num post que já havia dado like
                const updatedLike = Number(!like);
                const updatedLikesDislikes = new LikesDislikes(userId, postId, updatedLike);

                const updatedLikesDislikesDB : LikesDislikesDB = {
                    user_id: updatedLikesDislikes.getUserId(),
                    post_id: updatedLikesDislikes.getPostId(),
                    like: updatedLikesDislikes.getLike()
                }

                await likesDislikesDatabase.updateLikeByUserAndPostId(
                    updatedLikesDislikesDB,
                    userId,
                    postId
                );

                deltaLikes = updatedLike ? 1 : -1;
                deltaDislikes = updatedLike ? -1 : 1;
            }
        }

        const updatedPost = new Post(
            postDB.id,
            postDB.content,
            postDB.likes + deltaLikes,
            postDB.dislikes + deltaDislikes,
            postDB.created_at,
            postDB.updated_at,
            {
                id: postDB.id,
                name: "" // não fará diferença
            }
        )

        const updatedPostDB = updatedPost.toDBModel();
        await postDatabase.updatePostById(updatedPostDB, postId);
    }

    public async deletePostById(id : string) : Promise<void>{
        const postDatabase = new PostDatabase();
        const postDB = await postDatabase.findPostById(id);

        const likesDislikesDatabase = new LikesDislikesDatabase();
        const likesDislikesDB = await likesDislikesDatabase.findLikesByPostId(id);

        if (!postDB){
            throw new NotFoundError("Não existe um post com esse 'id'");
        }
        if (likesDislikesDB.length > 0){
            await likesDislikesDatabase.deleteLikesByPostId(id);
        }
        await postDatabase.deletePostById(id);
    }
}