import { Router } from "express";
import { getAllUsers, getUserById } from "./user.controller";
import { pagination } from "../middleware/pagination";

const userRouter = Router();

userRouter.get("/users", pagination, getAllUsers);
userRouter.get("/users/:id", getUserById);

export default userRouter;