import { z } from "zod";

export const appointmentValidator = z.object({
    userId: z.number().int().positive("User ID must be a positive integer"),
    doctorId: z.number().int().positive("Doctor ID must be a positive integer"),
    appointmentDate: z.string().refine(date => !isNaN(Date.parse(date)), "Invalid date format"),
    timeSlot: z.string().min(1, "Time slot is required"),
    totalAmount: z.string().min(0, "Total amount must be a positive number"),
    appointmentStatus: z.enum(["pending", "confirmed", "cancelled"]).default("pending"),
});