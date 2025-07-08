import { Router } from "express";
import { getAllUsers, getUserById,updateUserById,deleteUserById,updateUserRoleOnly } from "./user.controller";
import { pagination } from "../middleware/pagination";
import { adminAuth } from "../middleware/bearAuth";

const userRouter = Router();

userRouter.get("/users", pagination, getAllUsers);
userRouter.get("/users/:id", getUserById);
userRouter.patch("/users/:id", updateUserById);
userRouter.delete("/users/:id", deleteUserById);
userRouter.patch("/users/role/:id", adminAuth, updateUserRoleOnly);

export default userRouter;