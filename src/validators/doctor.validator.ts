import { z } from "zod";

export const createDoctorValidator = z.object({
    userId: z.number().int().positive("User ID must be a positive integer"),
    specialization: z.string().min(1, "Specialization is required"),
    contactPhone: z.string().min(1, "Contact phone is required"),
    availableDays: z.string().min(1, "Available days are required"),
});