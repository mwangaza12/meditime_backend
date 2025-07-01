import { Router } from "express";
import { getAllUsers, getUserById } from "./user.controller";

const userRouter = Router();

userRouter.get("/users", getAllUsers);
userRouter.get("/users/:id", getUserById);

export default userRouter;