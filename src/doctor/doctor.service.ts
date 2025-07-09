import { desc, eq, sql } from "drizzle-orm";
import db from "../drizzle/db";
import { DoctorInsert, doctors, DoctorSelect, users, UserSelect } from "../drizzle/schema";

export const getDoctorsService = async (page: number, pageSize: number) => {
    const [doctorsList, totalResult] = await Promise.all([
        db.query.doctors.findMany({
        with: {
            appointments: true,
            prescriptions: true,
            user: {
            columns: {
                password: false,
            },
            },
        },
        orderBy: desc(doctors.doctorId),
        offset: pageSize * (page - 1),
        limit: pageSize,
        }),
        db.select({ count: sql<number>`count(*)` }).from(doctors), // Correct way to count
    ]);

    const totalCount = totalResult[0]?.count ?? 0;

    return { doctors: doctorsList, total: totalCount };
};


export const getDoctorByIdService = async (doctorId: number): Promise<DoctorSelect | undefined> => {
    const doctor = await db.query.doctors.findFirst({
        where: (doctors) => eq(doctors.doctorId, doctorId),
        with: {
            appointments: true,
            prescriptions: true,
        },
    });

    return doctor;
}

export const createDoctorService = async (doctor: DoctorInsert): Promise<DoctorSelect> => {
    const [newDoctor] = await db.insert(doctors).values(doctor).returning();

    return newDoctor;
}

export const updateDoctorService = async (doctorId: number, doctor: DoctorInsert): Promise<DoctorSelect | undefined> => {
    const [updatedDoctor] = await db.update(doctors)
        .set(doctor)
        .where(eq(doctors.doctorId, doctorId))
        .returning();

    return updatedDoctor;
}

export const deleteDoctorService = async (doctorId: number): Promise<string> => {
    await db.delete(doctors).where(eq(doctors.doctorId, doctorId));
    return "Doctor deleted successfully 😎";
}

export const getUserDoctorsService = async (page: number, pageSize: number): Promise<{ doctors: UserSelect[]; total: number } | null> => {
    const [doctorsList, totalResult] = await Promise.all([
        db.query.users.findMany({
            where: eq(users.role, 'doctor'),
            orderBy: desc(users.userId),
            offset: pageSize * (page - 1),
            limit: pageSize,
        }),
        db.select({ count: sql<number>`count(*)` }).from(doctors),
    ]);

    const totalCount = totalResult[0]?.count ?? 0;

    return { doctors: doctorsList, total: totalCount };
};
