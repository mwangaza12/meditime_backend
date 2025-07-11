import { Router } from "express";
import { createPayment, deletePayment, getAllPayments, getPaymentById } from "./payment.controller";
import { pagination } from "../middleware/pagination";
import { adminAuth, adminOrUserAuth, userAuth } from "../middleware/bearAuth";
const paymentRouter = Router();

paymentRouter.get("/payments",pagination,adminAuth, getAllPayments);
paymentRouter.get("/payments/:id",adminOrUserAuth, getPaymentById);
paymentRouter.post("/payments",userAuth, createPayment);
paymentRouter.delete("/payments/:id", deletePayment);

export default paymentRouter;
