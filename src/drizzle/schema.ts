// drizzle/schema.ts
import {pgTable,serial,varchar,text,decimal,integer,date,timestamp,pgEnum,boolean} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Define all enums first - this ensures they're created before tables that reference them
export const userRoleEnum = pgEnum("role", ['user', 'admin', 'doctor']);
export const appointmentStatusEnum = pgEnum("appointmentStatus", ['pending','confirmed','cancelled']);
export const complaintStatusEnum = pgEnum("status", ['open','in_progress','resolved','closed']);
export const paymentStatusEnum = pgEnum("paymentStatus", ['pending', 'completed', 'failed']);


export type UserRole = typeof userRoleEnum.enumValues[number];

// Users Table
export const users = pgTable("users", {
    userId: serial("user_id").primaryKey(),
    firstName: varchar("firstName", { length: 255 }),
    lastName: varchar("lastname", { length: 255 }),
    email: varchar("email", { length: 255 }).unique(),
    emailVerified: boolean("emailVerified").default(false),
    confirmationCode: varchar("confirmationCode", { length: 255 }).default(""),
    password: varchar("password", { length: 255 }),
    contactPhone: varchar("contactPhone", { length: 20 }),
    address: text("address"),
    role: userRoleEnum("role").default("user"),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow(),
});

// Doctors Table
export const doctors = pgTable("doctors", {
    doctorId: serial("doctorId").primaryKey(),
    userId: integer("userId").references(() => users.userId).unique(),
    specialization: varchar("specialization", { length: 255 }),
    contactPhone: varchar("contactPhone", { length: 20 }),
    availableDays: varchar("availableDays", { length: 255 }),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow(),
});

// Appointments Table
export const appointments = pgTable("appointments", {
    appointmentId: serial("appointmentId").primaryKey(),
    userId: integer("userId").references(() => users.userId),
    doctorId: integer("doctorId").references(() => doctors.doctorId),
    appointmentDate: date("appointmentDate"),
    timeSlot: varchar("timeSlot", { length: 50 }),
    totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }),
    appointmentStatus: appointmentStatusEnum("appointmentStatus"),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow(),
});

// Prescriptions Table
export const prescriptions = pgTable("prescriptions", {
    prescriptionId: serial("prescriptionId").primaryKey(),
    appointmentId: integer("appointmentId").references(() => appointments.appointmentId),
    doctorId: integer("doctorId").references(() => doctors.doctorId),
    patientId: integer("patientId").references(() => users.userId),
    notes: text("notes"),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow(),
});

// Payments Table
export const payments = pgTable("payments", {
    paymentId: serial("paymentId").primaryKey(),
    appointmentId: integer("appointmentId").references(() => appointments.appointmentId),
    amount: decimal("amount", { precision: 10, scale: 2 }),
    paymentStatus: paymentStatusEnum("paymentStatus").default("pending"),
    transactionId: varchar("transactionId", { length: 255 }),
    paymentDate: date("paymentDate"),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow(),
});

// Complaints Table
export const complaints = pgTable("complaints", {
    complaintId: serial("complaintId").primaryKey(),
    userId: integer("userId").references(() => users.userId),
    relatedAppointmentId: integer("relatedAppointmentId").references(() => appointments.appointmentId),
    subject: varchar("subject", { length: 255 }),
    description: text("description"),
    status: complaintStatusEnum("status"),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow(),
});

// Relations
export const userRelations = relations(users, ({ many }) => ({
    appointments: many(appointments),
    complaints: many(complaints),
    prescriptions: many(prescriptions),
}));

export const doctorRelations = relations(doctors, ({ one, many }) => ({
    user: one(users, {
        fields: [doctors.userId],
        references: [users.userId],
    }),
    appointments: many(appointments),
    prescriptions: many(prescriptions),
}));

export const appointmentRelations = relations(appointments, ({ one, many }) => ({
    user: one(users, {
        fields: [appointments.userId],
        references: [users.userId],
    }),
    doctor: one(doctors, {
        fields: [appointments.doctorId],
        references: [doctors.doctorId],
    }),
    prescriptions: many(prescriptions),
    payments: many(payments),
    complaints: many(complaints),
}));

export const prescriptionRelations = relations(prescriptions, ({ one }) => ({
    doctor: one(doctors, {
        fields: [prescriptions.doctorId],
        references: [doctors.doctorId],
    }),
    patient: one(users, {
        fields: [prescriptions.patientId],
        references: [users.userId],
    }),
    appointment: one(appointments, {
        fields: [prescriptions.appointmentId],
        references: [appointments.appointmentId],
    }),
}));

export const paymentRelations = relations(payments, ({ one }) => ({
    appointment: one(appointments, {
        fields: [payments.appointmentId],
        references: [appointments.appointmentId],
    }),
}));

export const complaintRelations = relations(complaints, ({ one }) => ({
    user: one(users, {
        fields: [complaints.userId],
        references: [users.userId],
    }),
    appointment: one(appointments, {
        fields: [complaints.relatedAppointmentId],
        references: [appointments.appointmentId],
    }),
}));

// Types
export type UserSelect = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;

export type DoctorSelect = typeof doctors.$inferSelect;
export type DoctorInsert = typeof doctors.$inferInsert;

export type AppointmentSelect = typeof appointments.$inferSelect;
export type AppointmentInsert = typeof appointments.$inferInsert;

export type PrescriptionSelect = typeof prescriptions.$inferSelect;
export type PrescriptionInsert = typeof prescriptions.$inferInsert;

export type PaymentSelect = typeof payments.$inferSelect;
export type PaymentInsert = typeof payments.$inferInsert;

export type ComplaintSelect = typeof complaints.$inferSelect;
export type ComplaintInsert = typeof complaints.$inferInsert;