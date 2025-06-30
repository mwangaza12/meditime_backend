// drizzle/schema.ts
import {pgTable,serial,varchar,text,decimal,integer,date,timestamp,pgEnum,unique,} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

const userRoleEnum = pgEnum("role", ["user", "admin", "doctor"]);
const appointmentStatusEnum = pgEnum("appointment_status", ["Pending","Confirmed","Cancelled",]);
const complaintStatusEnum = pgEnum("status", ["Open","In Progress","Resolved","Closed",]);

// Users Table
export const users = pgTable("users", {
    userId: serial("user_id").primaryKey(),
    firstname: varchar("firstname", { length: 255 }),
    lastname: varchar("lastname", { length: 255 }),
    email: varchar("email", { length: 255 }).unique(),
    password: varchar("password", { length: 255 }),
    contactPhone: varchar("contact_phone", { length: 20 }),
    address: text("address"),
    role: userRoleEnum("role").default("user"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// Doctors Table
export const doctors = pgTable("doctors", {
    doctorId: serial("doctor_id").primaryKey(),
    firstName: varchar("first_name", { length: 255 }),
    lastName: varchar("last_name", { length: 255 }),
    specialization: varchar("specialization", { length: 255 }),
    contactPhone: varchar("contact_phone", { length: 20 }),
    availableDays: varchar("available_days", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// Appointments Table
export const appointments = pgTable("appointments", {
    appointmentId: serial("appointment_id").primaryKey(),
    userId: integer("user_id").references(() => users.userId),
    doctorId: integer("doctor_id").references(() => doctors.doctorId),
    appointmentDate: date("appointment_date"),
    timeSlot: varchar("time_slot", { length: 50 }),
    totalAmount: decimal("total_amount", { precision: 10, scale: 2 }),
    appointmentStatus: appointmentStatusEnum("appointment_status"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// Prescriptions Table
export const prescriptions = pgTable("prescriptions", {
    prescriptionId: serial("prescription_id").primaryKey(),
    appointmentId: integer("appointment_id").references(() => appointments.appointmentId),
    doctorId: integer("doctor_id").references(() => doctors.doctorId),
    patientId: integer("patient_id").references(() => users.userId),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// Payments Table
export const payments = pgTable("payments", {
    paymentId: serial("payment_id").primaryKey(),
    appointmentId: integer("appointment_id").references(() => appointments.appointmentId),
    amount: decimal("amount", { precision: 10, scale: 2 }),
    paymentStatus: varchar("payment_status", { length: 50 }),
    transactionId: varchar("transaction_id", { length: 255 }),
    paymentDate: date("payment_date"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// Complaints Table
export const complaints = pgTable("complaints", {
    complaintId: serial("complaint_id").primaryKey(),
    userId: integer("user_id").references(() => users.userId),
    relatedAppointmentId: integer("related_appointment_id").references(() => appointments.appointmentId),
    subject: varchar("subject", { length: 255 }),
    description: text("description"),
    status: complaintStatusEnum("status"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});


// Relations

export const userRelations = relations(users, ({ many }) => ({
    appointments: many(appointments),
    complaints: many(complaints),
    prescriptions: many(prescriptions),
}));

export const doctorRelations = relations(doctors, ({ many }) => ({
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
