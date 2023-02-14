import express from "express";
import { UserBusiness } from "../business/UserBusiness";
import { UserController } from "../controller/UserController";
import { UserDatabase } from "../database/UserDatabase";
import { UserDTO } from "../dtos/UserDTO";

const userController = new UserController(
    new UserBusiness(
        new UserDatabase(),
        new UserDTO()
    ), 
    new UserDTO());
    
export const userRouter = express.Router();

userRouter.get("/", userController.getUsers);
userRouter.get("/:id", userController.getUserById);
userRouter.post("/signup", userController.createUser);