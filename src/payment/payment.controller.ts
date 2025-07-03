import { Request, Response } from "express";
import { createPaymentService, deletePaymentService, getAllPaymentsService, getPaymentByIdService } from "./payment.service";

export const getAllPayments = async (req: Request, res: Response) => {
    const page = Number(req.body.page);
    const pageSize = Number(req.query.pageSize);
    
    try {
        const payments = await getAllPaymentsService(page, pageSize);
        if (!payments || payments.length === 0) {
            res.status(404).json({ error: "No payments found" });
            return;
        }
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch payments" });
    }
}

export const getPaymentById = async (req: Request, res: Response) => {
    const paymentId = parseInt(req.params.id);
    if (isNaN(paymentId)) {
        res.status(400).json({ error: "Invalid payment ID" });
        return;
    }

    try {
        const payment = await getPaymentByIdService(paymentId);
        if (!payment) {
            res.status(404).json({ error: "Payment not found" });
            return;
        }
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch payment" });
    }
}

export const createPayment = async (req: Request, res: Response) => {
    const paymentData = req.body; // Assuming validation is done elsewhere
    try {
        const newPayment = await createPaymentService(paymentData);
        res.status(201).json(newPayment);
    } catch (error) {
        res.status(500).json({ error: "Failed to create payment" });
    }
}

export const deletePayment = async (req: Request, res: Response) => {
    const paymentId = parseInt(req.params.id);
    if (isNaN(paymentId)) {
        res.status(400).json({ error: "Invalid payment ID" });
        return;
    }

    try {
        const message = await deletePaymentService(paymentId);
        res.status(200).json({ message });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete payment" });
    }
}