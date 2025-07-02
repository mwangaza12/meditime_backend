import { Router } from "express";
import { createPrescription, getPrescriptionById, getPrescriptions, updatePrescription, deletePrescription } from "./prescription.controller"; 
import { pagination } from "../middleware/pagination";
import { doctorAuth, doctorOrUserAuth } from "../middleware/bearAuth";

const prescriptionRouter = Router();

prescriptionRouter.get("/prescriptions",pagination,doctorAuth, getPrescriptions);
prescriptionRouter.get("/prescriptions/:id",doctorOrUserAuth, getPrescriptionById);
prescriptionRouter.post("/prescriptions",doctorAuth, createPrescription);
prescriptionRouter.put("/prescriptions/:id",doctorAuth, updatePrescription);
prescriptionRouter.delete("/prescriptions/:id",doctorAuth, deletePrescription);

export default prescriptionRouter;