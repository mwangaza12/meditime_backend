import { Router } from "express";
import { getAllUsers, getUserById,updateUserById,deleteUserById } from "./user.controller";
import { pagination } from "../middleware/pagination";
import { adminAuth } from "../middleware/bearAuth";

const userRouter = Router();

userRouter.get("/users", pagination,adminAuth, getAllUsers);
userRouter.get("/users/:id", getUserById);
userRouter.patch("/users/:id", updateUserById);
userRouter.delete("/users/:id", deleteUserById);

export default userRouter;