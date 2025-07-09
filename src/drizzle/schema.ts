import {pgTable,serial,varchar,text,decimal,integer,date,time,timestamp,pgEnum,boolean} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const userRoleEnum = pgEnum("role", ["user", "admin", "doctor"]);
export const appointmentStatusEnum = pgEnum("appointmentStatus", ["pending", "confirmed", "cancelled"]);
export const complaintStatusEnum = pgEnum("complaintStatus", ["open", "in_progress", "resolved", "closed"]);
export const paymentStatusEnum = pgEnum("paymentStatus", ["pending", "completed", "failed"]);
export const dayOfWeekEnum = pgEnum("dayOfWeek", ["monday","tuesday","wednesday","thursday","friday","saturday","sunday",]);


// Specializations Table
export const specializations = pgTable("specializations", {
    specializationId: serial("specializationId").primaryKey(),
    name: varchar("name", { length: 100 }).unique(),
    description: text("description"),
});

// Users Table
export const users = pgTable("users", {
    userId: serial("userId").primaryKey(),
    firstName: varchar("firstName", { length: 255 }),
    lastName: varchar("lastName", { length: 255 }),
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
    userId: integer("userId").references(() => users.userId, { onDelete: "cascade" }).unique(),
    specializationId: integer("specializationId").references(() => specializations.specializationId, { onDelete: "set null" }),
    contactPhone: varchar("contactPhone", { length: 20 }),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow(),
});

// Doctor Availability Table
export const doctorAvailability = pgTable("doctorAvailability", {
    availabilityId: serial("availabilityId").primaryKey(),
    doctorId: integer("doctorId").references(() => doctors.doctorId, { onDelete: "cascade" }),
    dayOfWeek: dayOfWeekEnum("dayOfWeek"),
    startTime: time("startTime"),
    endTime: time("endTime"),
    slotDurationMinutes: integer("slotDurationMinutes").default(30),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow(),
});

// Appointments Table
export const appointments = pgTable("appointments", {
    appointmentId: serial("appointmentId").primaryKey(),
    userId: integer("userId").references(() => users.userId, { onDelete: "cascade" }),
    doctorId: integer("doctorId").references(() => doctors.doctorId, { onDelete: "cascade" }),
    appointmentDate: date("appointmentDate"),
    timeSlot: time("timeSlot"),
    durationMinutes: integer("durationMinutes").default(30),
    totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }),
    appointmentStatus: appointmentStatusEnum("appointmentStatus").default("pending"),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow(),
});

// Prescriptions Table
export const prescriptions = pgTable("prescriptions", {
    prescriptionId: serial("prescriptionId").primaryKey(),
    appointmentId: integer("appointmentId").references(() => appointments.appointmentId, { onDelete: "cascade" }),
    doctorId: integer("doctorId").references(() => doctors.doctorId, { onDelete: "cascade" }),
    patientId: integer("patientId").references(() => users.userId, { onDelete: "cascade" }),
    notes: text("notes"),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow(),
});

// Payments Table
export const payments = pgTable("payments", {
    paymentId: serial("paymentId").primaryKey(),
    appointmentId: integer("appointmentId").references(() => appointments.appointmentId, { onDelete: "cascade" }),
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
    userId: integer("userId").references(() => users.userId, { onDelete: "cascade" }),
    relatedAppointmentId: integer("relatedAppointmentId").references(() => appointments.appointmentId, { onDelete: "cascade" }),
    subject: varchar("subject", { length: 255 }),
    description: text("description"),
    status: complaintStatusEnum("complaintStatus"),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow(),
});

// User Relations
export const userRelations = relations(users, ({ many }) => ({
    appointments: many(appointments),
    complaints: many(complaints),
    prescriptions: many(prescriptions),
}));

// Doctor Relations
export const doctorRelations = relations(doctors, ({ one, many }) => ({
    user: one(users, {
        fields: [doctors.userId],
        references: [users.userId],
    }),
    specialization: one(specializations, {
        fields: [doctors.specializationId],
        references: [specializations.specializationId],
    }),
    appointments: many(appointments),
    prescriptions: many(prescriptions),
    availability: many(doctorAvailability),
}));

// Specialization Relations
export const specializationRelations = relations(specializations, ({ many }) => ({
    doctors: many(doctors),
}));

// Doctor Availability Relations
export const availabilityRelations = relations(doctorAvailability, ({ one }) => ({
    doctor: one(doctors, {
        fields: [doctorAvailability.doctorId],
        references: [doctors.doctorId],
    }),
}));

// Appointment Relations
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

// Prescription Relations
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

// Payment Relations
export const paymentRelations = relations(payments, ({ one }) => ({
    appointment: one(appointments, {
        fields: [payments.appointmentId],
        references: [appointments.appointmentId],
    }),
}));

// Complaint Relations
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

// User Types
export type UserSelect = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;

// Doctor Types
export type DoctorSelect = typeof doctors.$inferSelect;
export type DoctorInsert = typeof doctors.$inferInsert;

// Specialization Types
export type SpecializationSelect = typeof specializations.$inferSelect;
export type SpecializationInsert = typeof specializations.$inferInsert;

// Doctor Availability Types
export type DoctorAvailabilitySelect = typeof doctorAvailability.$inferSelect;
export type DoctorAvailabilityInsert = typeof doctorAvailability.$inferInsert;

// Appointment Types
export type AppointmentSelect = typeof appointments.$inferSelect;
export type AppointmentInsert = typeof appointments.$inferInsert;

// Prescription Types
export type PrescriptionSelect = typeof prescriptions.$inferSelect;
export type PrescriptionInsert = typeof prescriptions.$inferInsert;

// Payment Types
export type PaymentSelect = typeof payments.$inferSelect;
export type PaymentInsert = typeof payments.$inferInsert;

// Complaint Types
export type ComplaintSelect = typeof complaints.$inferSelect;
export type ComplaintInsert = typeof complaints.$inferInsert;
