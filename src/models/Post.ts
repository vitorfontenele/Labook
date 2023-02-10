export class Post {
    constructor(
        private id : string,
        private creatorId : string,
        private content : string,
        private likes : string,
        private dislikes : string,
        private createdAt : string,
        private updatedAt : string
    ){}
}