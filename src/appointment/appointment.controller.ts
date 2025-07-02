import { Request, Response } from "express";
import { createAppointmentService, deleteAppointmentService, getAllAppointmentsService, getAppointmentByIdService, updateAppointmentService } from "./appointment.service";
import { appointmentValidator } from "../validators/appointment.validator";

export const getAppointments = async (req: Request, res: Response) => {
    const page = Number(req.query.page );
    const pageSize = Number(req.query.pageSize );
    
    try {
        const appointments = await getAllAppointmentsService(page, pageSize);
        if (!appointments || appointments.length === 0) {
            res.status(404).json({ error: "No appointments found" });
            return;
        }
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch appointments" });
        return;
    }
}

export const getAppointmentById = async (req: Request, res: Response) => {
    const appointmentId = parseInt(req.params.id);
    if (isNaN(appointmentId)) {
        res.status(400).json({ error: "Invalid appointment ID" });
        return;
    }

    try {
        const appointment = await getAppointmentByIdService(appointmentId);
        if (!appointment) {
            res.status(404).json({ error: "Appointment not found" });
            return;
        }
        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch appointment" });
        return;
    }
}

export const createAppointment = async (req: Request, res: Response) => {
    const appointmentData = appointmentValidator.safeParse(req.body);

    if (!appointmentData.success) {
        res.status(400).json({ error: "Invalid appointment data", appointmentData: appointmentData.error.errors });
        return;
    }

    const validatedData = appointmentData.data;
    try {
        const newAppointment = await createAppointmentService(validatedData);
        res.status(201).json(newAppointment);
    } catch (error) {
        res.status(500).json({ error: "Failed to create appointment" });
        return;
    }
}

export const updateAppointment = async (req: Request, res: Response) => {
    const appointmentId = parseInt(req.params.id);
    if (isNaN(appointmentId)) {
        res.status(400).json({ error: "Invalid appointment ID" });
        return;
    }

    const appointmentData = appointmentValidator.safeParse(req.body);
    if (!appointmentData.success) {
        res.status(400).json({ error: "Invalid appointment data", appointmentData: appointmentData.error.errors });
        return;
    }

    const validatedData = appointmentData.data;

    try {
        const updatedAppointment = await updateAppointmentService(appointmentId,validatedData);
        if (!updatedAppointment) {
            res.status(404).json({ error: "Appointment not found" });
            return;
        }
        res.status(200).json(updatedAppointment);
    } catch (error) {
        res.status(500).json({ error: "Failed to update appointment" });
        return;
    }
}

export const deleteAppointment = async (req: Request, res: Response) => {
    const appointmentId = parseInt(req.params.id);
    if (isNaN(appointmentId)) {
        res.status(400).json({ error: "Invalid appointment ID" });
        return;
    }

    try {
        const result = await deleteAppointmentService(appointmentId);
        res.status(200).json({ message: result });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete appointment" });
        return;
    }
}