import e, { Request, Response } from "express";
import { deleteUserByIdService, getAllUsersService, getUserByIdService, updateUserByIdService,  } from "./user.service";   
import { registerUserValidator } from "../validators/user.validator";

export const getAllUsers = async (req: Request, res: Response) => {
    const page = Number(req.query.page);
    const pageSize = Number(req.query.pageSize);

    try {
        const users = await getAllUsersService(page, pageSize);
        if (!users || users.length === 0) {
            res.status(404).json({ error: "No users found" });
            return;
        }
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
}

export const getUserById = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
    }

    try {
        const user = await getUserByIdService(userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user" });
    }
}

export const updateUserById = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    const parsedData = registerUserValidator.safeParse(req.body);
    
    if (isNaN(userId)) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
    }
    if (!parsedData.success) {
        res.status(400).json({ error: "Invalid user data", details: parsedData.error.errors });
        return;
    }

    const userData = parsedData.data;

    try {
        const updatedUser = await updateUserByIdService(userId, userData);
        if (!updatedUser) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: "Failed to update user" });
    }
}


export const deleteUserById = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
    }

    try {
        const message = await deleteUserByIdService(userId);
        res.status(200).json({ message });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete user" });
    }
}

