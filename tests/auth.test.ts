import request from 'supertest'
import app from '../src/app';
import db from '../src/drizzle/db';
import { users } from '../src/drizzle/schema';
import { eq } from 'drizzle-orm';

describe('Authentication API Integration Tests', () => {
    const testUser = {
        name: "Charlie",
        email: "charlie@example.com",
        password: "secret123",
        contactPhone: "1234567890",
        confirmationCode: null,
        emailVerified: true,
        role: "user",
    };

    it('should register a new user', async () => {
        const res = await request(app).post("/api/auth/register").send(testUser);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('user', 'User registered successfully');
        expect(res.body).toHaveProperty('email', 'Email sent successfully');

        // ✅ Set emailVerified to true for login test
        await db.update(users)
            .set({ emailVerified: true })
            .where(eq(users.email, testUser.email));
    });

    it('should login an existing user', async () => {
        const res = await request(app).post("/api/auth/login").send({
            email: testUser.email,
            password: testUser.password
        });

        console.log('Login response:', res.status, res.body); // Optional: Debug

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('userId');
    });

    afterAll(async () => {
        await db.delete(users).where(eq(users.email, testUser.email));
    });
});