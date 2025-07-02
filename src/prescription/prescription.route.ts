import { Router } from "express";
import { createPrescription, getPrescriptionById, getPrescriptions, updatePrescription, deletePrescription } from "./prescription.controller"; 
import { pagination } from "../middleware/pagination";

const prescriptionRouter = Router();

prescriptionRouter.get("/prescriptions",pagination, getPrescriptions);
prescriptionRouter.get("/prescriptions/:id", getPrescriptionById);
prescriptionRouter.post("/prescriptions", createPrescription);
prescriptionRouter.put("/prescriptions/:id", updatePrescription);
prescriptionRouter.delete("/prescriptions/:id", deletePrescription);

export default prescriptionRouter;