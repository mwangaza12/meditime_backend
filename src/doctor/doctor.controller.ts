import { Request, Response } from "express";
import { createDoctorService, deleteDoctorService, getDoctorByIdService, getDoctorsService, updateDoctorService } from "./doctor.service";
import { createDoctorValidator } from "../validators/doctor.validator";

export const getDoctors = async(req: Request, res: Response) => {
    const page = Number(req.query.page) || 1; // Default to page 1 if not provided
    const pageSize = Number(req.query.pageSize) || 10; // Default to page size of 10 if not provide

     if (page <= 0 || pageSize <= 0) {
        res.status(400).json({ error: "Invalid page or pageSize" });
        return;
    }

    try {
        const doctors = await getDoctorsService(page, pageSize);
        if (!doctors || doctors.length === 0) {
            res.status(404).json({ error: "No doctors found" });
            return;
        }
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch doctors" });
        return
    }
}

export const getDoctorById = async(req: Request, res: Response) => {
    const doctorId = parseInt(req.params.id);
    if (isNaN(doctorId)) {
        res.status(400).json({ error: "Invalid doctor ID" });
        return;
    }

    try {
        const doctor = await getDoctorByIdService(doctorId);
        if (!doctor) {
            res.status(404).json({ error: "Doctor not found" });
            return;
        }
        res.status(200).json(doctor);
    } catch (error) {
        console.error("Error fetching doctor:", error);
        res.status(500).json({ error: "Failed to fetch doctor", details: error instanceof Error ? error.message : String(error) });
    }
}

export const createDoctor = async(req: Request, res: Response) => {
    const doctor = createDoctorValidator.safeParse(req.body);
    if (!doctor.success) {
        res.status(400).json({ error: "Invalid doctor data" });
        return;
    }
    const doctorData = doctor.data;

    try {
        const newDoctor = await createDoctorService(doctorData);
        res.status(201).json(newDoctor);
    } catch (error) {
        res.status(500).json({ error: "Failed to create doctor" });
        return
    }
}

export const updateDoctor = async(req: Request, res: Response) => {
    const doctorId = parseInt(req.params.id);
    if (isNaN(doctorId)) {
         res.status(400).json({ error: "Invalid doctor ID" });
         return
    }

    const doctorData = createDoctorValidator.safeParse(req.body);
    if (!doctorData.success) {
         res.status(400).json({ error: "Invalid doctor data" });
         return
    }

    const doctor = doctorData.data;

    try {
        const updatedDoctor = await updateDoctorService(doctorId, doctor);
        if (!updatedDoctor) {
             res.status(404).json({ error: "Doctor not found" });
             return
        }
        res.status(200).json(updatedDoctor);
    } catch (error) {
        res.status(500).json({ error: "Failed to update doctor" });
        return;
    }
}

export const deleteDoctor = async(req: Request, res: Response) => {
    const doctorId = parseInt(req.params.id);
    if (isNaN(doctorId)) {
        res.status(400).json({ error: "Invalid doctor ID" });
        return
    }

    try {
        await deleteDoctorService(doctorId);
        res.status(200).json({ message: "Doctor deleted successfully 😎" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete doctor" });
    }
}