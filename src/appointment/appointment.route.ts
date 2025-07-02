import { Router } from "express";
import { getAppointments, getAppointmentById, createAppointment, updateAppointment, deleteAppointment } from "./appointment.controller";
import { pagination } from "../middleware/pagination";
import { adminAuth } from "../middleware/bearAuth";

const appointmentRouter = Router();

appointmentRouter.get("/appointments",pagination,adminAuth, getAppointments);
appointmentRouter.get("/appointments/:id", getAppointmentById);
appointmentRouter.post("/appointments", createAppointment);
appointmentRouter.put("/appointments/:id", updateAppointment);
appointmentRouter.delete("/appointments/:id", deleteAppointment);

export default appointmentRouter;