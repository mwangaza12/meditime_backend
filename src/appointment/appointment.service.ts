import { desc, eq } from "drizzle-orm";
import db from "../drizzle/db";
import { AppointmentInsert, appointments, AppointmentSelect, doctors } from "../drizzle/schema";

export const getAllAppointmentsService = async (page: number, pageSize: number): Promise<AppointmentSelect[] | null> => {
    const appointmentsList = await db.query.appointments.findMany({
        with: {
            user: {
                columns: {
                    firstName: true,
                    lastName: true,
                }
            },
            doctor: {
                columns: {
                    specialization: true
                },
                with: {
                    user: {
                        columns: {
                            firstName: true,
                            lastName: true,
                            
                        }
                    },
                }
            },
            prescriptions: true,
            payments: true,
            complaints: true,
        },
        orderBy: desc(appointments.appointmentId),
    });

    return appointmentsList;
}

export const getAppointmentByIdService = async (appointmentId: number): Promise<AppointmentSelect | undefined> => {
    const appointment = await db.query.appointments.findFirst({
        where: eq(appointments.appointmentId, appointmentId),
        with: {
            user: {
                columns: {
                    firstName: true,
                    lastName: true,
                }
            },
            doctor: {
                columns: {
                    specialization: true
                },
                with: {
                    user: {
                        columns: {
                            firstName: true,
                            lastName: true,
                            
                        }
                    },
                }
            },
            prescriptions: true,
            payments: true,
            complaints: true,
        },
    });

    return appointment;
}

export const createAppointmentService = async (appointment: AppointmentInsert): Promise<AppointmentSelect> => {
    const [newAppointment] = await db.insert(appointments).values(appointment).returning();

    return newAppointment;
}

export const updateAppointmentService = async (appointmentId: number, appointment: AppointmentInsert): Promise<AppointmentSelect | undefined> => {
    const [updatedAppointment] = await db.update(appointments)
        .set(appointment)
        .where(eq(appointments.appointmentId, appointmentId))
        .returning();

    return updatedAppointment;
}

export const deleteAppointmentService = async (appointmentId: number): Promise<string> => {
    await db.delete(appointments).where(eq(appointments.appointmentId, appointmentId));
    return "Appointment deleted successfully";
}

export const getAppointmentsByUserIdService = async (userId: number,page: number, pageSize: number):  Promise<AppointmentSelect[] | null> => {
    const appointmentsList = await db.query.appointments.findMany({
        where: eq(appointments.userId, userId),
        with: {
            user: {
                columns: {
                    firstName: true,
                    lastName: true,
                }
            },
            doctor: {
                columns: {
                    specialization: true
                },
                with: {
                    user: {
                        columns: {
                            firstName: true,
                            lastName: true,
                            
                        }
                    },
                }
            },
            prescriptions: true,
            payments: true,
            complaints: true,
        },
        orderBy: desc(appointments.appointmentId),
        offset: (page - 1) * pageSize,
        limit: pageSize,

    })

    return appointmentsList;
}

export const getAppointmentsByDoctorIdService = async (userId: number, page: number, pageSize: number): Promise<AppointmentSelect[] | null> => {
  // Find the doctor record linked to this userId
  const doctorRecord = await db.query.doctors.findFirst({
    where: eq(doctors.userId, userId),
    columns: { doctorId: true }
  });

  if (!doctorRecord) {
    // No doctor linked to this userId
    return null;
  }

  const doctorId = doctorRecord.doctorId;

  // Now find appointments for this doctorId
  const appointmentsList = await db.query.appointments.findMany({
    where: eq(appointments.doctorId, doctorId),
    with: {
      user: {
        columns: {
          firstName: true,
          lastName: true,
        },
      },
      doctor: {
        columns: {
          specialization: true,
        },
        with: {
          user: {
            columns: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      prescriptions: true,
      payments: true,
      complaints: true,
    },
    orderBy: desc(appointments.appointmentId),
    offset: (page - 1) * pageSize,
    limit: pageSize,
  });

  return appointmentsList;
};