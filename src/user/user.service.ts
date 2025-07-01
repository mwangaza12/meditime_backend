import { eq } from "drizzle-orm";
import { users, UserSelect } from "../drizzle/schema";
import db from "../drizzle/db";


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

export const getAllUsersService = async (): Promise<UserSelect[] | null> => {
    const usersList = await db.query.users.findMany({
        with: {
            appointments: true,
            complaints: true,
        },
    });

    return usersList;
}
