package hu.bme.jj.appointmentapp.backend.service

import hu.bme.jj.appointmentapp.backend.api.model.AppointmentDTO
import hu.bme.jj.appointmentapp.backend.api.model.UserDTO
import hu.bme.jj.appointmentapp.backend.db.sql.repository.AppointmentRepository
import hu.bme.jj.appointmentapp.backend.db.sql.repository.ServiceRepository
import hu.bme.jj.appointmentapp.backend.db.sql.model.Appointment
import hu.bme.jj.appointmentapp.backend.db.sql.model.ProviderAvailability
import hu.bme.jj.appointmentapp.backend.db.sql.model.UserData
import hu.bme.jj.appointmentapp.backend.db.sql.repository.ProviderRepository
import hu.bme.jj.appointmentapp.backend.db.sql.repository.SubServiceRepository
import hu.bme.jj.appointmentapp.backend.db.sql.repository.UserRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.sql.Date
import java.time.LocalDate
import java.time.temporal.TemporalAdjusters

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
            date = appointment.date.toLocalDate(),
            startTime = appointment.startTime.toLocalTime(),
            endTime = appointment.endTime.toLocalTime(),
            customerId = appointment.customer.id!!, // Field not nullable in DB. Cannot be null
            providerId = appointment.provider.id!!, // Field not nullable in DB. Cannot be null
            subServiceId = appointment.subService.id!! // Field not nullable in DB. Cannot be null
        )
    }

    fun mapToEntity(appointment: AppointmentDTO): Appointment {
        return Appointment(
            id = appointment.id,
            date = java.sql.Date.valueOf(appointment.date),
            startTime = java.sql.Time.valueOf(appointment.startTime),
            endTime = java.sql.Time.valueOf(appointment.endTime),
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

    override fun getAppointmentsForCustomer(customerId: Long): List<AppointmentDTO> {
        return appointmentRepository.findByCustomerId(customerId).map { mapToDTO(it) }
    }

    override fun getAppointmentsForProvider(providerId: Long): List<AppointmentDTO> {
        return appointmentRepository.findByProviderId(providerId).map { mapToDTO(it) }
    }

    override fun getAppointmentsForProviderAfter(providerId: Long, date: LocalDate): List<AppointmentDTO> {
        return appointmentRepository.findByProviderIdAndDateGreaterThan(providerId, java.sql.Date.valueOf(date)).map { mapToDTO(it) }
    }

    override fun getAllAppointmentsForUser(userId: Long): List<AppointmentDTO> {
        return getAppointmentsForCustomer(userId).plus(getAppointmentsForProvider(userId))
    }

    @Scheduled(cron = "0 0 20 * * *")
    fun sendAppointmentNotifications() {
        val nextDay = java.sql.Date.valueOf(LocalDate.now().plusDays(1))
        appointmentRepository.findByDate(nextDay).forEach {
            if (it.customer.sendDailyAppointmentNotification) {
                if (it.customer.email != null) {
                    
                }
            }
        }
    }
}