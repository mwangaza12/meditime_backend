import { z } from "zod";

export const createDoctorValidator = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    specialization: z.string().min(1, "Specialization is required"),
    contactPhone: z.string().min(1, "Contact phone is required"),
    availableDays: z.string().min(1, "Available days are required"),
});