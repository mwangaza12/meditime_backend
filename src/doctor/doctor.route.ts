import { Router } from "express";
import { createDoctor, deleteDoctor, getDoctorById, getDoctors, updateDoctor } from "./doctor.controller";

const doctorRouter = Router();

doctorRouter.get("/doctors", getDoctors);
doctorRouter.get("/doctors/:id", getDoctorById);
doctorRouter.post("/doctors", createDoctor);
doctorRouter.put("/doctors/:id", updateDoctor);
doctorRouter.delete("/doctors/:id", deleteDoctor);

export default doctorRouter;