import request from 'supertest';
import app from '../src/app';
import db from '../src/drizzle/db';
import { payments } from '../src/drizzle/schema';
import { eq } from 'drizzle-orm';

describe('Payment API Integration Tests', () => {
    const testPayment = {
        userId: 1,
        appointmentId: 1,
        amount: 100.00,
        paymentMethod: 'credit_card',
        status: 'pending',
    };

    it('should create a new payment', async () => {
        const res = await request(app).post('/api/payments').send(testPayment);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('payment');
        expect(res.body.payment).toHaveProperty('paymentId');
    });

    it('should retrieve all payments for a user', async () => {
        const res = await request(app).get('/api/payments/user/1');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.payments)).toBe(true);
    });

    it('should update an existing payment', async () => {
        const res = await request(app)
            .put('/api/payments/1')
            .send({ status: 'completed' });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('payment');
        expect(res.body.payment.status).toBe('completed');
    });

    afterAll(async () => {
        await db.delete(payments).where(eq(payments.paymentId, 1));
    });
});