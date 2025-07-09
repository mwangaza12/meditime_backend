import { Router } from "express";
import {getAppointments,getAppointmentById,createAppointment,updateAppointment,deleteAppointment, getAppointmentsByUserId, getAppointmentsByDoctorId} from "./appointment.controller";
import { pagination } from "../middleware/pagination";
import { adminAuth, doctorAuth } from "../middleware/bearAuth";

const appointmentRouter = Router();

appointmentRouter.get("/appointments", pagination, getAppointments);
appointmentRouter.get("/appointments/user",getAppointmentsByUserId);
appointmentRouter.get("/appointments/doctor",doctorAuth,getAppointmentsByDoctorId);
appointmentRouter.get("/appointments/:id", getAppointmentById);
appointmentRouter.post("/appointments", createAppointment);
appointmentRouter.put("/appointments/:id", updateAppointment);
appointmentRouter.delete("/appointments/:id", deleteAppointment);

export default appointmentRouter;
