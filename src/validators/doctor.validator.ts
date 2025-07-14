import { z } from "zod";

export const createDoctorValidator = z.object({
    userId: z.number().int().positive("User ID must be a positive integer"),
    specializationId: z.number().int().positive("Specialization is required"),
});