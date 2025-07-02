import { Router } from "express";
import { createComplaint, deleteComplaint, getAllComplaints, getComplaintById, updateComplaint } from "./complaint.controller";
import { pagination } from "../middleware/pagination";

const complaintRouter = Router();

complaintRouter.get("/complaints",pagination, getAllComplaints);
complaintRouter.get("/complaints/:id", getComplaintById);
complaintRouter.post("/complaints", createComplaint);
complaintRouter.put("/complaints/:id", updateComplaint);
complaintRouter.delete("/complaints/:id", deleteComplaint);

export default complaintRouter;