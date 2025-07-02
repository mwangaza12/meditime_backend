import { desc, eq } from "drizzle-orm";
import { UserInsert, users, UserSelect } from "../drizzle/schema";
import db from "../drizzle/db";


export const getAllUsersService = async (page: number, pageSize: number): Promise<UserSelect[] | null> => {
    const usersList = await db.query.users.findMany({
        with: {
            appointments: true,
            complaints: true,
        },
        orderBy: desc(users.userId),
        offset: (page - 1) * pageSize,
        limit: pageSize,
    });

    return usersList;
}

export const getUserByIdService = async (userId: number): Promise<UserSelect | undefined> => {
    const user = await db.query.users.findFirst({
        where: eq(users.userId, userId),
        with: {
            appointments: true,
            complaints: true,
        },
    });

    return user;
}

export const updateUserByIdService = async (userId: number, userData: UserInsert): Promise<UserSelect | undefined> => {
    const updatedUser = await db.update(users)
        .set(userData)
        .where(eq(users.userId, userId))
        .returning();

    return updatedUser[0];
}

export const deleteUserByIdService = async (userId: number): Promise<string> => {
    await db.delete(users).where(eq(users.userId, userId));
    return `User with ID ${userId} deleted successfully`;
}
