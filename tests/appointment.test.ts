import request from 'supertest';
import app from '../src/app';
import db from '../src/drizzle/db';
import { appointments } from '../src/drizzle/schema';
import { eq } from 'drizzle-orm';

describe('Appointment API Integration Tests', () => {
    const testAppointment = {
        userId: 1,
        doctorId: 1,
        appointmentDate: new Date(),
        status: 'scheduled',
        notes: 'Initial consultation',
    };

    it('should create a new appointment', async () => {
        const res = await request(app).post('/api/appointments').send(testAppointment);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('appointment');
        expect(res.body.appointment).toHaveProperty('appointmentId');
    });

    it('should retrieve all appointments for a user', async () => {
        const res = await request(app).get('/api/appointments/user/1');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.appointments)).toBe(true);
    });

    it('should update an existing appointment', async () => {
        const res = await request(app)
            .put('/api/appointments/1')
            .send({ status: 'completed' });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('appointment');
        expect(res.body.appointment.status).toBe('completed');
    });

    afterAll(async () => {
        await db.delete(appointments).where(eq(appointments.appointmentId, 1));
    });
});