import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { PrescriptionInsert, prescriptions, PrescriptionSelect } from "../drizzle/schema"


export const getPrescriptionService = async(): Promise<PrescriptionSelect[] | null> => {
    const prescriptions = await db.query.prescriptions.findMany({
        with: {
            doctor: true,
            patient: true,
            appointment: true,
        },
    });

    return prescriptions;
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