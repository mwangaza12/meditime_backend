import { Router } from "express";
import {createComplaint,deleteComplaint,getAllComplaints,getComplaintById,updateComplaint,getComplaintByUserId,} from "./complaint.controller";
import { getAllComplaintReplies, addComplaintReply } from "../complaintReplies/complaintReplies.controller";


import { pagination } from "../middleware/pagination";
import { adminAuth, allRolesAuth, userAuth } from "../middleware/bearAuth";

const complaintRouter = Router();

// Complaint CRUD
complaintRouter.get("/complaints", pagination, adminAuth, getAllComplaints);
complaintRouter.get("/complaints/:id", adminAuth, getComplaintById);
complaintRouter.post("/complaints", userAuth, createComplaint);
complaintRouter.put("/complaints/:id", adminAuth, updateComplaint);
complaintRouter.delete("/complaints/:id", adminAuth, deleteComplaint);
complaintRouter.get("/complaints/user/:userId", userAuth, getComplaintByUserId);

complaintRouter.get("/complaints/:complaintId/replies", allRolesAuth, getAllComplaintReplies);
complaintRouter.post("/complaints/:complaintId/replies",allRolesAuth, addComplaintReply);

export default complaintRouter;
