package hu.bme.jj.appointmentapp.backend.service

import hu.bme.jj.appointmentapp.backend.api.model.AppointmentDTO
import hu.bme.jj.appointmentapp.backend.api.model.UserDTO
import hu.bme.jj.appointmentapp.backend.db.sql.repository.AppointmentRepository
import hu.bme.jj.appointmentapp.backend.db.sql.repository.ServiceRepository
import hu.bme.jj.appointmentapp.backend.db.sql.model.Appointment
import hu.bme.jj.appointmentapp.backend.db.sql.model.UserData
import hu.bme.jj.appointmentapp.backend.db.sql.repository.ProviderRepository
import hu.bme.jj.appointmentapp.backend.db.sql.repository.SubServiceRepository
import hu.bme.jj.appointmentapp.backend.db.sql.repository.UserRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.stereotype.Service

@Service
class AppointmentService(
    private val appointmentRepository: AppointmentRepository,
    private val providerRepository: ProviderRepository,
    private val userRepository: UserRepository,
    private val subServiceRepository: SubServiceRepository
): IAppointmentService {
    fun mapToDTO(appointment: Appointment): AppointmentDTO {
        return AppointmentDTO(
            id = appointment.id,
            date = appointment.date,
            customerId = appointment.customer.id!!, // Field not nullable in DB. Cannot be null
            providerId = appointment.provider.id!!, // Field not nullable in DB. Cannot be null
            subServiceId = appointment.subService.id!! // Field not nullable in DB. Cannot be null
        )
    }

    fun mapToEntity(appointment: AppointmentDTO): Appointment {
        return Appointment(
            id = appointment.id,
            date = appointment.date,
            customer = userRepository.findById(appointment.customerId)
                .orElseThrow { EntityNotFoundException("User not found with id ${appointment.customerId}") },
            provider = providerRepository.findByUserId(appointment.providerId)
                .orElseThrow { EntityNotFoundException("Provider not found with id ${appointment.providerId}") },
            subService = subServiceRepository.findById(appointment.subServiceId)
                .orElseThrow { EntityNotFoundException("Service not found with id ${appointment.subServiceId}") }
        )
    }
    override fun bookAppointment(appointment: AppointmentDTO): AppointmentDTO {
        return mapToDTO(
            appointmentRepository.save(
                mapToEntity(appointment)
            )
        )
    }

}