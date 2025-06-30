import { Router } from "express";
import { getAppointments, getAppointmentById, createAppointment, updateAppointment, deleteAppointment } from "./appointment.controller";

const appointmentRouter = Router();

appointmentRouter.get("/appointments", getAppointments);
appointmentRouter.get("/appointments/:id", getAppointmentById);
appointmentRouter.post("/appointments", createAppointment);
appointmentRouter.put("/appointments/:id", updateAppointment);
appointmentRouter.delete("/appointments/:id", deleteAppointment);

export default appointmentRouter;