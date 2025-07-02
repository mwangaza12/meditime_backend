import { Router } from "express";
import { createComplaint, deleteComplaint, getAllComplaints, getComplaintById, updateComplaint,getComplaintByUserId } from "./complaint.controller";
import { pagination } from "../middleware/pagination";
import { adminAuth, userAuth } from "../middleware/bearAuth";

const complaintRouter = Router();

complaintRouter.get("/complaints",pagination,userAuth, getAllComplaints);
complaintRouter.get("/complaints/:id",adminAuth, getComplaintById);
complaintRouter.post("/complaints",userAuth, createComplaint);
complaintRouter.put("/complaints/:id",adminAuth, updateComplaint);
complaintRouter.delete("/complaints/:id",adminAuth, deleteComplaint);
complaintRouter.get("/complaints/user/:userId", userAuth, getComplaintByUserId);

export default complaintRouter;