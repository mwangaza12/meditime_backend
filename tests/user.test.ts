import request from 'supertest';
import app from '../src/app';
import db from '../src/drizzle/db';
import { users } from '../src/drizzle/schema';
import { eq } from 'drizzle-orm';

describe('User API Integration Tests', () => {
    const testUser = {
        name: "Alice",
        email: "alice@gmail.com",
        password: "password123",
        contactPhone: "1234567890",
        confirmationCode: null,
        emailVerified: true,
        role: "user",
    };

    it('should create a new user', async () => {
        const res = await request(app).post('/api/users').send(testUser);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('user');
        expect(res.body.user).toHaveProperty('userId');
    });

    it('should retrieve a user by ID', async () => {
        const res = await request(app).get('/api/users/1');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('user');
        expect(res.body.user).toHaveProperty('id', 1);
    });

    it('should update an existing user', async () => {
        const updatedUser = {
            name: "Alice Updated",
            contactPhone: "0987654321"
        };
        const res = await request(app)
            .put('/api/users/1')
            .send(updatedUser);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('user');
        expect(res.body.user.name).toBe(updatedUser.name);
        expect(res.body.user.contactPhone).toBe(updatedUser.contactPhone);
    });

    afterAll(async () => {
        await db.delete(users).where(eq(users.email, testUser.email));
    });
}); 