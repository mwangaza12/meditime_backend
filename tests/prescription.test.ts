import request from 'supertest';
import app from '../src/app';
import db from '../src/drizzle/db';
import { prescriptions } from '../src/drizzle/schema';
import { eq } from 'drizzle-orm';

describe('Prescription API Integration Tests', () => {
    const testPrescription = {
        userId: 1,
        doctorId: 1,
        medication: 'Test Medication',
        dosage: '500mg',
        frequency: 'Twice a day',
        duration: '7 days',
        notes: 'Take with food',
    };

    it('should create a new prescription', async () => {
        const res = await request(app).post('/api/prescriptions').send(testPrescription);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('prescription');
        expect(res.body.prescription).toHaveProperty('prescriptionId');
    });

    it('should retrieve all prescriptions for a user', async () => {
        const res = await request(app).get('/api/prescriptions/user/1');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.prescriptions)).toBe(true);
    });

    it('should update an existing prescription', async () => {
        const res = await request(app)
            .put('/api/prescriptions/1')
            .send({ dosage: '1000mg' });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('prescription');
        expect(res.body.prescription.dosage).toBe('1000mg');
    });

    afterAll(async () => {
        await db.delete(prescriptions).where(eq(prescriptions.prescriptionId, 1));
    });
});