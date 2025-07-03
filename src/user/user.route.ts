import { Router } from "express";
import { getAllUsers, getUserById } from "./user.controller";
import { pagination } from "../middleware/pagination";
import { adminAuth } from "../middleware/bearAuth";

const userRouter = Router();

userRouter.get("/users", pagination,adminAuth, getAllUsers);
userRouter.get("/users/:id", getUserById);


export default userRouter;