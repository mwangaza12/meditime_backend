import { desc, eq } from "drizzle-orm";
import db from "../drizzle/db";
import { appointments, AppointmentSelect, PaymentInsert, payments, PaymentSelect } from "../drizzle/schema";

export const getAllPaymentsService = async(page:number, pageSize: number): Promise<PaymentSelect[] | null> => {
    const paymentList = await db.query.payments.findMany({
        with: {
            appointment: {
                columns: {
                    appointmentStatus: true,
                    appointmentDate: true,
                },
                with: {
                    user: {
                        columns:{
                            firstName: true,
                            lastName: true
                        }
                    },
                    doctor:{
                        columns: {
                            specializationId: true
                        },
                        with: {
                            user: {
                                columns: {
                                    firstName: true,
                                    lastName: true
                                }
                            }
                        }
                    }
                }
            },
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
            appointment: {
                columns: {
                    appointmentStatus: true,
                    appointmentDate: true,
                },
                with: {
                    user: {
                        columns:{
                            firstName: true,
                            lastName: true
                        }
                    },
                    doctor:{
                        columns: {
                            specializationId: true
                        },
                        with: {
                            user: {
                                columns: {
                                    firstName: true,
                                    lastName: true
                                }
                            }
                        }
                    }
                }
            },
        },
    });

    return payment;
}

export const createPaymentService = async (payment: PaymentInsert): Promise<PaymentSelect | undefined> => {
    const [newPayment] = await db.insert(payments).values(payment).returning();

    return newPayment;
}

export const deletePaymentService = async (paymentId: number): Promise<string> => {
    await db.delete(payments).where(eq(payments.paymentId, paymentId));
    return "Payment deleted successfully";
}

export const getPaymentsByUserIdService = async (userId: number,page: number,pageSize: number): Promise<AppointmentSelect[] | null> => {
    const appointmentsWithPayments = await db.query.appointments.findMany({
        where: eq(appointments.userId, userId),
        with: {
        payments: true,
        user: {
            columns: { password: false },
        },
        doctor: {
            with: {
            user: {
                columns: { password: false },
            },
            },
        },
        },
        orderBy: desc(appointments.appointmentId),
        offset: (page - 1) * pageSize,
        limit: pageSize,
    });

    return appointmentsWithPayments;
};

