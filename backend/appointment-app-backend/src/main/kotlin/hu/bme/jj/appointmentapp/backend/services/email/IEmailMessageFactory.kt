package hu.bme.jj.appointmentapp.backend.services.email

import hu.bme.jj.appointmentapp.backend.db.sql.model.Appointment
import hu.bme.jj.appointmentapp.backend.model.EmailMessage

interface IEmailMessageFactory {
    fun createAppointmentNotificationEmail(appointment: Appointment): EmailMessage

    fun createAppointmentReportEmail(appointments: List<Appointment>): EmailMessage?

    fun createAppointmentModifiedEmail(appointment: Appointment): EmailMessage

    fun createAppointmentCancelledEmail(appointment: Appointment, customerCancelled: Boolean): EmailMessage
}