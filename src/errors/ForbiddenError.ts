import { BaseError } from "./BaseError";

export class ForbidenError extends BaseError {
    constructor(
        message = "Forbidden"
    ){
       super(403, message) 
    }
}