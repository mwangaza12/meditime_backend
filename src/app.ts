import express, { Application,Response } from 'express';
import dotenv from 'dotenv';
import cors from "cors"
import { authRouter } from './auth/auth.route';
import { logger } from './middleware/logger';

dotenv.config();

const app: Application = express();

// Basic Middleware
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Import Routes
app.use('/api', authRouter);

//default route
app.get('/', (req, res:Response) => {
  res.send("Welcome to MediTime Express API Backend With Drizzle ORM and PostgreSQL");
});


const PORT = process.env.PORT || 5000;

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;
  