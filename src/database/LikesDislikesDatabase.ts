import { BaseDatabase } from "./BaseDatabase";

export class LikesDislikesDB extends BaseDatabase {
    public static TABLE_LIKES_DISLIKES = "likes_dislikes";

    public async findLikeByUserAndPostId(user_id : string, post_id : string){
        const [ result ] : LikesDislikesDB[] | undefined[] = await BaseDatabase
            .connection(LikesDislikesDB.TABLE_LIKES_DISLIKES)
            .where({user_id, post_id});

        return result;
    }

    public async createLike(newLikeDB : LikesDislikesDB){
        await BaseDatabase
            .connection(LikesDislikesDB.TABLE_LIKES_DISLIKES)
            .insert(newLikeDB);
    }

    public async updateLikeByUserAndPostId(updatedLikeDB : LikesDislikesDB, user_id : string, post_id : string){
        await BaseDatabase
            .connection(LikesDislikesDB.TABLE_LIKES_DISLIKES)
            .update(updatedLikeDB)
            .where({user_id, post_id});
    }

    public async deleteLikeByUserAndPostId(user_id : string, post_id : string){
        await BaseDatabase
            .connection(LikesDislikesDB.TABLE_LIKES_DISLIKES)
            .del()
            .where({user_id, post_id});
    }
}