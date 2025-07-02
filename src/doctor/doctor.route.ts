import { Router } from "express";
import { createDoctor, deleteDoctor, getDoctorById, getDoctors, updateDoctor } from "./doctor.controller";
import { pagination } from "../middleware/pagination";
import { adminAuth } from "../middleware/bearAuth";

const doctorRouter = Router();

doctorRouter.get("/doctors",pagination,adminAuth, getDoctors);
doctorRouter.get("/doctors/:id",adminAuth, getDoctorById);
doctorRouter.post("/doctors",adminAuth, createDoctor);
doctorRouter.put("/doctors/:id",adminAuth, updateDoctor);
doctorRouter.delete("/doctors/:id",adminAuth, deleteDoctor);

export default doctorRouter;