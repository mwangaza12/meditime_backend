import { z } from "zod";

export const appointmentValidator = z.object({
    userId: z.number().int().positive("User ID must be a positive integer"),
    doctorId: z.number().int().positive("Doctor ID must be a positive integer"),
    availabilityId: z.number().int().positive("Availability ID must be a positive integer"),
    totalAmount: z.string().min(0, "Total amount must be a positive number"),
    appointmentStatus: z.enum(["pending", "confirmed", "cancelled"]).default("pending"),
});