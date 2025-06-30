import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { AppointmentInsert, appointments, AppointmentSelect } from "../drizzle/schema";

export const getAllAppointmentsService = async (): Promise<AppointmentSelect[] | null> => {
    const appointments = await db.query.appointments.findMany({
        with: {
            user: true,
            doctor: true,
            prescriptions: true,
            payments: true,
            complaints: true,
        },
    });

    return appointments;
}

export const getAppointmentByIdService = async (appointmentId: number): Promise<AppointmentSelect | undefined> => {
    const appointment = await db.query.appointments.findFirst({
        where: eq(appointments.appointmentId, appointmentId),
        with: {
            user: true,
            doctor: true,
            prescriptions: true,
            payments: true,
            complaints: true,
        },
    });

    return appointment;
}

export const createAppointmentService = async (appointment: AppointmentInsert): Promise<AppointmentSelect> => {
    const [newAppointment] = await db.insert(appointments).values(appointment).returning();

    return newAppointment;
}

export const updateAppointmentService = async (appointmentId: number, appointment: AppointmentInsert): Promise<AppointmentSelect | undefined> => {
    const [updatedAppointment] = await db.update(appointments)
        .set(appointment)
        .where(eq(appointments.appointmentId, appointmentId))
        .returning();

    return updatedAppointment;
}

export const deleteAppointmentService = async (appointmentId: number): Promise<string> => {
    await db.delete(appointments).where(eq(appointments.appointmentId, appointmentId));
    return "Appointment deleted successfully";
}