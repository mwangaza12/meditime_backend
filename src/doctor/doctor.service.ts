import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { DoctorInsert, doctors, DoctorSelect } from "../drizzle/schema";

export const getDoctorsService = async (): Promise<DoctorSelect[]> => {
    const doctors = await db.query.doctors.findMany({
        with: {
            appointments: true,
            prescriptions: true,
        },
    });

    return doctors;
}

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