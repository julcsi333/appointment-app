package hu.bme.jj.appointmentapp.backend.services.appointment

import hu.bme.jj.appointmentapp.backend.api.model.AppointmentDTO
import hu.bme.jj.appointmentapp.backend.api.model.NewAppointmentDTO
import java.time.LocalDate

interface IAppointmentService {
    fun bookAppointment(appointment: NewAppointmentDTO): AppointmentDTO

    fun modifyAppointment(appointment: AppointmentDTO): AppointmentDTO

    fun cancelAppointment(appointmentId: Long, customerCancelled: Boolean)

    fun getAppointmentsForCustomer(customerId: Long): List<AppointmentDTO>

    fun getAppointmentsForProvider(providerId: Long): List<AppointmentDTO>

    fun getAllAppointmentsForUser(userId: Long): List<AppointmentDTO>

    fun getAppointmentsForProviderAfter(providerId: Long, date: LocalDate): List<AppointmentDTO>
}