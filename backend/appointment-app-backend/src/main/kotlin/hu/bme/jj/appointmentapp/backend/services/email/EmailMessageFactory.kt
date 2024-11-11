package hu.bme.jj.appointmentapp.backend.services.email

import hu.bme.jj.appointmentapp.backend.db.sql.model.Appointment
import hu.bme.jj.appointmentapp.backend.model.EmailMessage
import org.springframework.stereotype.Service

@Service
class EmailMessageFactory: IEmailMessageFactory {

    private val applicationName = "Appointment application"

    private fun getAppointmentNotificationBody(appointment: Appointment) = """
        Dear ${appointment.customer.name},
        
        This is a friendly reminder that you have an appointment scheduled with ${appointment.provider.user.name} tomorrow, ${appointment.date.toLocalDate()}, at ${appointment.startTime.toLocalTime()}.
        
        **Appointment Details:**
        - **Date:** ${appointment.date.toLocalDate()}
        - **Time:** ${appointment.startTime.toLocalTime()}
        - **Location:** ${appointment.provider.businessAddress}
        - **Service:** ${appointment.subService.mainService.globalService.name} - ${appointment.subService.name}
        
        If you need to reschedule or cancel your appointment, please contact ${appointment.provider.user.name} as soon as possible by email (${appointment.provider.user.email}) or phone (${appointment.provider.user.phoneNumber}).
        
        Best regards,
        $applicationName
    """.trimIndent()

    private fun getAppointmentModifiedBody(appointment: Appointment) = """
        Dear ${appointment.customer.name},
        
        Your appointment scheduled with ${appointment.provider.user.name} on ${appointment.date.toLocalDate()} at ${appointment.startTime.toLocalTime()} has been modified. You can see the modified details below.
        
        **Appointment Details:**
        - **Date:** ${appointment.date.toLocalDate()}
        - **Time:** ${appointment.startTime.toLocalTime()}
        - **Location:** ${appointment.provider.businessAddress}
        - **Service:** ${appointment.subService.mainService.globalService.name} - ${appointment.subService.name}
        
        If you need to reschedule or cancel your appointment, please contact ${appointment.provider.user.name} as soon as possible by email (${appointment.provider.user.email}) or phone (${appointment.provider.user.phoneNumber}).
        
        Best regards,
        $applicationName
    """.trimIndent()

    private fun getAppointmentCancelledBody(appointment: Appointment, customerCancelled: Boolean) = """
        Dear ${appointment.customer.name},
        
        Your appointment for ${appointment.subService.mainService.globalService.name}-${appointment.subService.name} scheduled with ${if(customerCancelled) appointment.customer.name else appointment.provider.user.name} on ${appointment.date.toLocalDate()} at ${appointment.startTime.toLocalTime()} has been cancelled.
        
        If you have any questions, please contact ${if(customerCancelled) appointment.customer.name else appointment.provider.user.name} by email (${if(customerCancelled) appointment.customer.email else appointment.provider.user.email}) or phone (${if(customerCancelled) appointment.customer.phoneNumber else appointment.provider.user.phoneNumber}).
        We are sorry for the inconvenience.
        
        Best regards,
        $applicationName
    """.trimIndent()

    private fun getAppointmentReportBody(clientsTable: String, appointment: Appointment) = """
        Dear ${appointment.provider.user.name},
        
        Please find below the list of appointments scheduled for tomorrow, ${appointment.date.toLocalDate()}. This report includes the details of all clients and their scheduled services.
        
        $clientsTable
        
        If you need to reschedule or cancel any of them, please notify the clients in advance.
        
        Best regards,
        $applicationName
    """.trimIndent()

    override fun createAppointmentNotificationEmail(appointment: Appointment): EmailMessage {
        return EmailMessage(
            appointment.customer.email!!,
            getAppointmentNotificationBody(appointment),
            "Your Appointment is Tomorrow at ${appointment.startTime.toLocalTime()}"
        )
    }

    override fun createAppointmentReportEmail(appointments: List<Appointment>): EmailMessage? {
        if (appointments.isEmpty()) {
            return null
        }
        var clientsTable = """
            | Time      | Client Name      | Main service           | Service                |
            |-----------|------------------|------------------------|------------------------|
        """.trimIndent()
        appointments.forEach {
            clientsTable += "\n| ${it.startTime.toLocalTime()}| ${it.customer.name}| ${it.subService.mainService.globalService.name}| ${it.subService.name}|"
        }
        return EmailMessage(
            appointments[0].provider.user.email!!,
            getAppointmentReportBody(clientsTable, appointments[0]),
            "Daily Appointment Report: ${appointments[0].date.toLocalDate()}"
        )
    }

    override fun createAppointmentModifiedEmail(appointment: Appointment): EmailMessage {
        return EmailMessage(
            appointment.customer.email!!,
            getAppointmentModifiedBody(appointment),
            "Your Appointment has been modified!"
        )
    }

    override fun createAppointmentCancelledEmail(appointment: Appointment, customerCancelled: Boolean): EmailMessage {
        return EmailMessage(
            if(customerCancelled) appointment.provider.user.email!! else appointment.customer.email!!,
            getAppointmentCancelledBody(appointment, customerCancelled),
            "Your Appointment has been cancelled!"
        )
    }
}