import e, { Request, Response } from "express";
import { deleteUserByIdService, getAllUsersService, getUserByIdService, updateUserByIdService, updateUserRoleService } from "./user.service";   
import { registerUserValidator } from "../validators/user.validator";

export const getAllUsers = async (req: Request, res: Response) => {
  const page = Number(req.query.page);
  const pageSize = Number(req.query.pageSize);

  try {
    const { users, total } = await getAllUsersService(page, pageSize);
    if (!users || users.length === 0) {
      res.status(404).json({ error: "No users found" });
      return;
    }
    res.status(200).json({ users, total });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};


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


export const updateUserRoleOnly = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);

  console.log(userId);
  if (isNaN(userId)) {
    res.status(400).json({ message: "Invalid user ID" });
    return 
  }

  const { role } = req.body;

  const allowedUserTypes = ["admin", "user", "doctor"] as const;

  if (!allowedUserTypes.includes(role)) {
    res.status(400).json({ message: "Invalid user type" });
    return 
  }

  try {
    const updatedUser = await updateUserRoleService(userId, role as typeof allowedUserTypes[number]);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user type:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
