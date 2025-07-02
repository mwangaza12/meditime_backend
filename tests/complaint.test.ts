import request from 'supertest';
import app from '../src/app';
import db from '../src/drizzle/db';
import { complaints } from '../src/drizzle/schema';
import { eq } from 'drizzle-orm';

describe('Complaint API Integration Tests', () => {
    const testComplaint = {
        userId: 1,
        doctorId: 1,
        complaintText: 'Test complaint',
        status: 'open',
    };

    it('should create a new complaint', async () => {
        const res = await request(app).post('/api/complaints').send(testComplaint);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('complaint');
        expect(res.body.complaint).toHaveProperty('complaintId');
    });

    it('should retrieve all complaints for a user', async () => {
        const res = await request(app).get('/api/complaints/user/1');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.complaints)).toBe(true);
    });

    it('should update an existing complaint', async () => {
        const res = await request(app)
            .put('/api/complaints/1')
            .send({ status: 'resolved' });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('complaint');
        expect(res.body.complaint.status).toBe('resolved');
    });

    afterAll(async () => {
        await db.delete(complaints).where(eq(complaints.complaintId, 1));
    });
});