import { desc, eq } from "drizzle-orm";
import db from "../drizzle/db";
import { PaymentInsert, payments, PaymentSelect } from "../drizzle/schema";


export const getAllPaymentsService = async(page:number, pageSize: number): Promise<PaymentSelect[] | null> => {
    const paymentList = await db.query.payments.findMany({
        with: {
            appointment: true,
        },
        orderBy: desc(payments.paymentId),
        offset: (page - 1) * pageSize,
        limit: pageSize,
    });

    return paymentList;
}

export const getPaymentByIdService = async (paymentId: number): Promise<PaymentSelect | undefined> => {
    const payment = await db.query.payments.findFirst({
        where: eq(payments.paymentId, paymentId),
        with: {
            appointment: true,
        },
    });

    return payment;
}

export const createPaymentService = async (payment: PaymentInsert): Promise<PaymentSelect | undefined> => {
    const [newPayment] = await db.insert(payments).values(payment).returning();

    return newPayment;
}

export const updatePaymentService = async (paymentId: number, payment: PaymentInsert): Promise<PaymentSelect | undefined> => {
    const [updatedPayment] = await db.update(payments)
        .set(payment)
        .where(eq(payments.paymentId, paymentId))
        .returning();

    return updatedPayment;
}

export const deletePaymentService = async (paymentId: number): Promise<string> => {
    await db.delete(payments).where(eq(payments.paymentId, paymentId));
    return "Payment deleted successfully";
}