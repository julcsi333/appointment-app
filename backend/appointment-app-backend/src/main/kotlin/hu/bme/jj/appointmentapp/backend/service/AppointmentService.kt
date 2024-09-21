package hu.bme.jj.appointmentapp.backend.service

import hu.bme.jj.appointmentapp.backend.api.model.AppointmentDTO
import hu.bme.jj.appointmentapp.backend.db.sql.repository.AppointmentRepository
import hu.bme.jj.appointmentapp.backend.db.sql.repository.ServiceRepository
import hu.bme.jj.appointmentapp.backend.db.sql.model.Appointment
import jakarta.persistence.EntityNotFoundException
import org.springframework.stereotype.Service

@Service
class AppointmentService(
    private val appointmentRepository: AppointmentRepository,
    private val providerService: ProviderService,
    private val userService: UserService,
    private val serviceRepository: ServiceRepository
) {

    fun bookAppointment(providerId: Long, appointment: AppointmentDTO): Appointment {
        val appointment = Appointment(
            id = null,
            date = appointment.date,
            customer = userService.getUserById(appointment.customerId),
            provider = providerService.getProviderById(providerId),
            mainService = serviceRepository.findById(appointment.serviceId).orElseThrow { EntityNotFoundException("Service not found with id ${appointment.serviceId}") }
        )
        return appointmentRepository.save(appointment)
    }
}