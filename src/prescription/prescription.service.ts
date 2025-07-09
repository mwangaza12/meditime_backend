import { desc, eq } from "drizzle-orm";
import db from "../drizzle/db";
import { PrescriptionInsert, prescriptions, PrescriptionSelect } from "../drizzle/schema"


export const getPrescriptionService = async(page: number, pageSize: number): Promise<PrescriptionSelect[] | null> => {
    const prescriptionsList = await db.query.prescriptions.findMany({
        with: {
            doctor: {
                with: {
                    user: {
                        columns:{
                            password: false,
                        }
                    }
                }
            },
            patient: {
                columns:{
                    password: false
                }
            },
            appointment: true,
        },
        orderBy: desc(prescriptions.prescriptionId),
        offset: (page - 1) * pageSize,
        limit: pageSize,
    });

    return prescriptionsList;
}

export const getPrescriptionByIdService = async (prescriptionId: number): Promise<PrescriptionSelect | undefined> => {
    const prescription = await db.query.prescriptions.findFirst({
        where: eq(prescriptions.prescriptionId, prescriptionId),
        with: {
            doctor: true,
            patient: true,
            appointment: true,
        },
    });

    return prescription;
}

export const createPrescriptionService = async (prescription: PrescriptionInsert): Promise<PrescriptionSelect> => {
    const [newPrescription] = await db.insert(prescriptions).values(prescription).returning();

    return newPrescription;
}

export const updatePrescriptionService = async (prescriptionId: number, prescription: PrescriptionInsert): Promise<PrescriptionSelect | undefined> => {
    const [updatedPrescription] = await db.update(prescriptions)
        .set(prescription)
        .where(eq(prescriptions.prescriptionId, prescriptionId))
        .returning();

    return updatedPrescription;
}

export const deletePrescriptionService = async (prescriptionId: number): Promise<string> => {
    await db.delete(prescriptions).where(eq(prescriptions.prescriptionId, prescriptionId));
    return "Prescription deleted successfully";
}

export const getPrescriptionsByUserIdService = async (userId: number,page: number, pageSize: number):  Promise<PrescriptionSelect[] | null> => {
    const prescriptionsList = await db.query.prescriptions.findMany({
        where: eq(prescriptions.patientId, userId),
        with: {
            doctor: {
                with: {
                    user: {
                        columns:{
                            password: false,
                        }
                    }
                }
            },
            patient: {
                columns:{
                    password: false
                }
            },
            appointment: true
        },
        orderBy: desc(prescriptions.prescriptionId),
        offset: (page - 1) * pageSize,
        limit: pageSize,

    })

    return prescriptionsList;
}

export const getPrescriptionsByDoctorIdService = async (userId: number,page: number, pageSize: number):  Promise<PrescriptionSelect[] | null> => {
    const prescriptionsList = await db.query.prescriptions.findMany({
        where: eq(prescriptions.doctorId, userId),
        with: {
            doctor: {
                with: {
                    user: {
                        columns:{
                            password: false,
                        }
                    }
                }
            },
            patient: {
                columns:{
                    password: false
                }
            },
            appointment: true
        },
        orderBy: desc(prescriptions.prescriptionId),
        offset: (page - 1) * pageSize,
        limit: pageSize,

    })

    return prescriptionsList;
}