import { LikesDislikesDatabase } from "../database/LikesDislikesDatabase";
import { PostDatabase } from "../database/PostDatabase";
import { UserDatabase } from "../database/UserDatabase";
import { CreatePostInputDTO, EditPostInputDTO, EditPostLikesInputDTO } from "../dtos/PostDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { LikesDislikes } from "../models/LikesDislikes";
import { Post } from "../models/Post";
import { LikesDislikesDB, PostDB, UserDB } from "../types";

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

    public async createPost(input : CreatePostInputDTO){
        const { content } = input;
        const postDatabase = new PostDatabase();

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

    public async updatePostById(input : EditPostInputDTO){
        const { content , id } = input;
        const postDatabase = new PostDatabase();

        const postDB = await postDatabase.findPostById(id);
        if (!postDB){
            throw new NotFoundError("Não foi encontrado um post com esse id");
        }

        postDB["content"] = content;
        postDB["updated_at"] = (new Date()).toISOString();

        await postDatabase.updatePostById(postDB, id);
    }

    public async updatePostLikesById(input : EditPostLikesInputDTO){
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

        postDB.likes += deltaLikes;
        postDB.dislikes += deltaDislikes;
        await postDatabase.updatePostById(postDB, postId);
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