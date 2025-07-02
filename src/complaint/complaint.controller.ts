import { Request, Response } from "express";
import { createComplaintService, deleteComplaintService, getAllComplaintsService, getComplaintByIdService, updateComplaintService } from "./complaint.service";
import { complaintValidator } from "../validators/complaint.validator";

export const getAllComplaints = async (req: Request, res: Response) => {
    const page = Number(req.query.page);
    const pageSize = Number(req.query.pageSize);
    try {
        const complaints = await getAllComplaintsService(page, pageSize);
        if (!complaints || complaints.length === 0) {
            res.status(404).json({ error: "No complaints found" });
            return;
        }
        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch complaints" });
    }
}

export const getComplaintById = async (req: Request, res: Response) => {
    const complaintId = parseInt(req.params.id);
    if (isNaN(complaintId)) {
        res.status(400).json({ error: "Invalid complaint ID" });
        return;
    }

    try {
        const complaint = await getComplaintByIdService(complaintId);
        if (!complaint) {
            res.status(404).json({ error: "Complaint not found" });
            return;
        }
        res.status(200).json(complaint);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch complaint" });
    }
}

export const createComplaint = async (req: Request, res: Response) => {
    const complaintData = complaintValidator.safeParse(req.body);
    if (!complaintData.success) {
        res.status(400).json({ error: "Invalid complaint data", details: complaintData.error.errors });
        return;
    }
    // Extract the validated data
    const complaint = complaintData.data;
    console.log(complaint);

    try {
        const newComplaint = await createComplaintService(complaint);
        res.status(201).json(newComplaint);
    } catch (error: any) {
        res.status(500).json({ error: "Failed to create complaint", details: error.message });
    }
}

export const updateComplaint = async (req: Request, res: Response) => {
    const complaintId = parseInt(req.params.id);
    if (isNaN(complaintId)) {
        res.status(400).json({ error: "Invalid complaint ID" });
        return;
    }

    const complaintData = req.body; // Assuming validation is done elsewhere
    try {
        const updatedComplaint = await updateComplaintService(complaintId, complaintData);
        if (!updatedComplaint) {
            res.status(404).json({ error: "Complaint not found" });
            return;
        }
        res.status(200).json(updatedComplaint);
    } catch (error) {
        res.status(500).json({ error: "Failed to update complaint" });
    }
}

export const deleteComplaint = async (req: Request, res: Response) => {
    const complaintId = parseInt(req.params.id);
    if (isNaN(complaintId)) {
        res.status(400).json({ error: "Invalid complaint ID" });
        return;
    }

    try {
        const result = await deleteComplaintService(complaintId);
        if (!result) {
            res.status(404).json({ error: "Complaint not found" });
            return;
        }
        res.status(200).json({ message: "Complaint closed successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to close complaint" });
    }
}