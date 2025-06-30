import { z } from "zod";

export const prescriptionValidator = z.object({
    appointmentId: z.number().int().positive("Appointment ID must be a positive integer"),
    notes: z.string().min(1, "Prescription details are required"),
    doctorId: z.number().int().positive("Doctor ID must be a positive integer"),
    patientId: z.number().int().positive("Patient ID must be a positive integer"),
});