import request from 'supertest';
import app from '../src/app';
import db from '../src/drizzle/db';
import { doctors } from '../src/drizzle/schema';
import { eq } from 'drizzle-orm';

describe('Doctor API Integration Tests', () => {
    const testDoctor = {
        name: "Dr. Smith",
        specialty: "Cardiology",
        contactPhone: "9876543210",
        email: "smith@gmail.com",
        address: "123 Heart St, Cardiology City",
        availableDays: ["Monday", "Wednesday", "Friday"],
        availableTimeSlots: ["09:00", "10:00", "11:00"],
        status: "active",
    }; 

    it('should create a new doctor', async () => {
        const res = await request(app).post('/api/doctors').send(testDoctor);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('doctor');
        expect(res.body.doctor).toHaveProperty('doctorId');
    });
    it('should retrieve all doctors', async () => {
        const res = await request(app).get('/api/doctors');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.doctors)).toBe(true);
    });
    it('should retrieve a doctor by ID', async () => {
        const res = await request(app).get('/api/doctors/1');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('doctor');
        expect(res.body.doctor).toHaveProperty('doctorId', 1);
    });
    it('should update an existing doctor', async () => {
        const res = await request(app)
            .put('/api/doctors/1')
            .send({ status: 'inactive' });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('doctor');
        expect(res.body.doctor.status).toBe('inactive');
    });
    afterAll(async () => {
        await db.delete(doctors).where(eq(doctors.doctorId, 1));
    });
});