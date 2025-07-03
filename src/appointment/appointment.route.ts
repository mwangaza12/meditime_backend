import { Router } from "express";
import {getAppointments,getAppointmentById,createAppointment,updateAppointment,deleteAppointment} from "./appointment.controller";
import { pagination } from "../middleware/pagination";
import { adminAuth } from "../middleware/bearAuth";

const appointmentRouter = Router();

/**
 * @openapi
 * /api/appointments:
 *   get:
 *     summary: Get all appointments
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Page size for pagination
 *     responses:
 *       200:
 *         description: List of appointments
 */
appointmentRouter.get("/appointments", pagination, adminAuth, getAppointments);

/**
 * @openapi
 * /api/appointments/{id}:
 *   get:
 *     summary: Get an appointment by ID
 *     tags:
 *       - Appointments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *     responses:
 *       200:
 *         description: Appointment found
 *       404:
 *         description: Appointment not found
 */
appointmentRouter.get("/appointments/:id", getAppointmentById);

/**
 * @openapi
 * /api/appointments:
 *   post:
 *     summary: Create a new appointment
 *     tags:
 *       - Appointments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientId:
 *                 type: string
 *               doctorId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               reason:
 *                 type: string
 *     responses:
 *       201:
 *         description: Appointment created
 *       400:
 *         description: Bad request
 */
appointmentRouter.post("/appointments", createAppointment);

/**
 * @openapi
 * /api/appointments/{id}:
 *   put:
 *     summary: Update an existing appointment
 *     tags:
 *       - Appointments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Appointment updated
 *       404:
 *         description: Appointment not found
 */
appointmentRouter.put("/appointments/:id", updateAppointment);

/**
 * @openapi
 * /api/appointments/{id}:
 *   delete:
 *     summary: Delete an appointment
 *     tags:
 *       - Appointments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *     responses:
 *       204:
 *         description: Appointment deleted
 *       404:
 *         description: Appointment not found
 */
appointmentRouter.delete("/appointments/:id", deleteAppointment);

export default appointmentRouter;
