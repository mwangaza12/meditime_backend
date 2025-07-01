import { Router } from "express";
import { createPayment, deletePayment, getAllPayments, getPaymentById, updatePayment } from "./payment.controller";
const paymentRouter = Router();

paymentRouter.get("/payments", getAllPayments);
paymentRouter.get("/payments/:id", getPaymentById);
paymentRouter.post("/payments", createPayment);
paymentRouter.put("/payments/:id", updatePayment);
paymentRouter.delete("/payments/:id", deletePayment);

export default paymentRouter;
