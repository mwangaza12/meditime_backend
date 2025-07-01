import e, { Request, Response } from "express";
import { getAllUsersService, getUserByIdService,  } from "./user.service";   

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await getAllUsersService();
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

