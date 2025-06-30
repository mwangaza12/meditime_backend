import { Router } from "express";
import { createPrescription, getPrescriptionById, getPrescriptions, updatePrescription, deletePrescription } from "./prescription.controller"; 

const prescriptionRouter = Router();

prescriptionRouter.get("/prescriptions", getPrescriptions);
prescriptionRouter.get("/prescriptions/:id", getPrescriptionById);
prescriptionRouter.post("/prescriptions", createPrescription);
prescriptionRouter.put("/prescriptions/:id", updatePrescription);
prescriptionRouter.delete("/prescriptions/:id", deletePrescription);

export default prescriptionRouter;