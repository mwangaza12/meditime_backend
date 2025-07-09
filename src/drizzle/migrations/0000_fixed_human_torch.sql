CREATE TYPE "public"."appointmentStatus" AS ENUM('pending', 'confirmed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."complaintStatus" AS ENUM('open', 'in_progress', 'resolved', 'closed');--> statement-breakpoint
CREATE TYPE "public"."dayOfWeek" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');--> statement-breakpoint
CREATE TYPE "public"."paymentStatus" AS ENUM('pending', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('user', 'admin', 'doctor');--> statement-breakpoint
CREATE TABLE "appointments" (
	"appointmentId" serial PRIMARY KEY NOT NULL,
	"userId" integer,
	"doctorId" integer,
	"appointmentDate" date,
	"timeSlot" time,
	"durationMinutes" integer DEFAULT 30,
	"totalAmount" numeric(10, 2),
	"appointmentStatus" "appointmentStatus" DEFAULT 'pending',
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "complaints" (
	"complaintId" serial PRIMARY KEY NOT NULL,
	"userId" integer,
	"relatedAppointmentId" integer,
	"subject" varchar(255),
	"description" text,
	"complaintStatus" "complaintStatus",
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "doctorAvailability" (
	"availabilityId" serial PRIMARY KEY NOT NULL,
	"doctorId" integer,
	"dayOfWeek" "dayOfWeek",
	"startTime" time,
	"endTime" time,
	"slotDurationMinutes" integer DEFAULT 30,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "doctors" (
	"doctorId" serial PRIMARY KEY NOT NULL,
	"userId" integer,
	"specializationId" integer,
	"contactPhone" varchar(20),
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "doctors_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"paymentId" serial PRIMARY KEY NOT NULL,
	"appointmentId" integer,
	"amount" numeric(10, 2),
	"paymentStatus" "paymentStatus" DEFAULT 'pending',
	"transactionId" varchar(255),
	"paymentDate" date,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "prescriptions" (
	"prescriptionId" serial PRIMARY KEY NOT NULL,
	"appointmentId" integer,
	"doctorId" integer,
	"patientId" integer,
	"notes" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "specializations" (
	"specializationId" serial PRIMARY KEY NOT NULL,
	"name" varchar(100),
	"description" text,
	CONSTRAINT "specializations_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"userId" serial PRIMARY KEY NOT NULL,
	"firstName" varchar(255),
	"lastName" varchar(255),
	"email" varchar(255),
	"emailVerified" boolean DEFAULT false,
	"confirmationCode" varchar(255) DEFAULT '',
	"password" varchar(255),
	"contactPhone" varchar(20),
	"address" text,
	"role" "role" DEFAULT 'user',
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_userId_users_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("userId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_doctorId_doctors_doctorId_fk" FOREIGN KEY ("doctorId") REFERENCES "public"."doctors"("doctorId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_userId_users_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("userId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_relatedAppointmentId_appointments_appointmentId_fk" FOREIGN KEY ("relatedAppointmentId") REFERENCES "public"."appointments"("appointmentId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctorAvailability" ADD CONSTRAINT "doctorAvailability_doctorId_doctors_doctorId_fk" FOREIGN KEY ("doctorId") REFERENCES "public"."doctors"("doctorId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_userId_users_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("userId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_specializationId_specializations_specializationId_fk" FOREIGN KEY ("specializationId") REFERENCES "public"."specializations"("specializationId") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_appointmentId_appointments_appointmentId_fk" FOREIGN KEY ("appointmentId") REFERENCES "public"."appointments"("appointmentId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_appointmentId_appointments_appointmentId_fk" FOREIGN KEY ("appointmentId") REFERENCES "public"."appointments"("appointmentId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_doctorId_doctors_doctorId_fk" FOREIGN KEY ("doctorId") REFERENCES "public"."doctors"("doctorId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_patientId_users_userId_fk" FOREIGN KEY ("patientId") REFERENCES "public"."users"("userId") ON DELETE cascade ON UPDATE no action;