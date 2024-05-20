package hu.bme.jj.appointmentapp.backend.db.service

import hu.bme.jj.appointmentapp.backend.api.model.Appointment
import hu.bme.jj.appointmentapp.backend.db.repository.AppointmentRepository
import hu.bme.jj.appointmentapp.backend.db.repository.ServiceRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.stereotype.Service

@Service
class AppointmentService(
    private val appointmentRepository: AppointmentRepository,
    private val providerService: ProviderService,
    private val userService: UserService,
    private val serviceRepository: ServiceRepository
) {

    fun bookAppointment(providerId: String, appointment: Appointment) {
        hu.bme.jj.appointmentapp.backend.db.model.Appointment(
            id = null,
            date = appointment.date,
            customer = userService.getUserById(appointment.customerId),
            provider = providerService.getProviderById(providerId.toLong()),
            service = serviceRepository.findById(appointment.serviceId).orElseThrow { EntityNotFoundException("Service not found with id ${appointment.serviceId}") }
        )
    }
}