package hu.bme.jj.appointmentapp.backend.services.appointment

import hu.bme.jj.appointmentapp.backend.api.model.AppointmentDTO
import hu.bme.jj.appointmentapp.backend.api.model.NewAppointmentDTO
import hu.bme.jj.appointmentapp.backend.db.sql.repository.AppointmentRepository
import hu.bme.jj.appointmentapp.backend.db.sql.model.Appointment
import hu.bme.jj.appointmentapp.backend.db.sql.repository.ProviderRepository
import hu.bme.jj.appointmentapp.backend.db.sql.repository.SubServiceRepository
import hu.bme.jj.appointmentapp.backend.db.sql.repository.UserRepository
import hu.bme.jj.appointmentapp.backend.services.email.IEmailService
import hu.bme.jj.appointmentapp.backend.services.email.IEmailMessageFactory
import jakarta.persistence.EntityExistsException
import jakarta.persistence.EntityNotFoundException
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.time.LocalDate

@Service
class AppointmentService(
    private val appointmentRepository: AppointmentRepository,
    private val providerRepository: ProviderRepository,
    private val userRepository: UserRepository,
    private val subServiceRepository: SubServiceRepository,
    private val emailMessageFactory: IEmailMessageFactory,
    private val emailService: IEmailService,
): IAppointmentService {


    fun mapToDTO(appointment: Appointment): AppointmentDTO {
        return AppointmentDTO(
            id = appointment.id,
            date = appointment.date.toLocalDate(),
            startTime = appointment.startTime.toLocalTime(),
            endTime = appointment.endTime.toLocalTime(),
            customerId = appointment.customer.id!!, // Field not nullable in DB. Cannot be null
            providerId = appointment.provider.user.id!!, // Field not nullable in DB. Cannot be null
            subServiceId = appointment.subService.id!!, // Field not nullable in DB. Cannot be null
            subServiceName = appointment.subService.name
        )
    }

    fun mapToEntity(appointment: AppointmentDTO): Appointment {
        if (appointment.id == null) {
            throw NullPointerException("Not new appointment with null id.")
        }
        val entity = appointmentRepository.findById(appointment.id).orElseThrow{
            EntityNotFoundException("Appointment not found with id #${appointment.id}")
        }
        return Appointment(
            id = appointment.id,
            date = java.sql.Date.valueOf(appointment.date),
            startTime = java.sql.Time.valueOf(appointment.startTime),
            endTime = java.sql.Time.valueOf(appointment.endTime),
            customer = entity.customer,
            provider = entity.provider,
            subService = entity.subService
        )
    }

    fun mapToEntity(appointment: NewAppointmentDTO): Appointment {
        val startTime = appointment.date.toLocalTime()
        val subService = subServiceRepository.findById(appointment.subServiceId)
            .orElseThrow { EntityNotFoundException("Service not found with id ${appointment.subServiceId}") }
        val endTime = startTime.plusMinutes(subService.duration.toLong())

        return Appointment(
            id = appointment.id,
            date = java.sql.Date.valueOf(appointment.date.toLocalDate()),
            startTime = java.sql.Time.valueOf(startTime),
            endTime = java.sql.Time.valueOf(endTime),
            customer = userRepository.findById(appointment.customerId)
                .orElseThrow { EntityNotFoundException("User not found with id ${appointment.customerId}") },
            provider = providerRepository.findByUserId(appointment.providerId)
                .orElseThrow { EntityNotFoundException("Provider not found with id ${appointment.providerId}") },
            subService = subService
        )
    }

    override fun bookAppointment(appointment: NewAppointmentDTO): AppointmentDTO {
        if (appointment.id != null && appointmentRepository.findById(appointment.id).orElse(null) != null) {
            throw EntityExistsException("Appointment entity ${appointment.id} already exists")
        }
        return mapToDTO(
            appointmentRepository.save(
                mapToEntity(appointment)
            )
        )
    }

    override fun modifyAppointment(appointment: AppointmentDTO): AppointmentDTO {
        if (appointment.id == null || appointmentRepository.findById(appointment.id).orElse(null) == null) {
            throw EntityNotFoundException("Appointment not found with id ${appointment.id}")
        }
        val modifiedAppointment = appointmentRepository.save(
            mapToEntity(appointment)
        )
        emailService.sendMail(
            emailMessageFactory.createAppointmentModifiedEmail(modifiedAppointment)
        )
        return mapToDTO(
            modifiedAppointment
        )
    }

    override fun cancelAppointment(appointmentId: Long, customerCancelled: Boolean) {
        val appointment = appointmentRepository.findById(appointmentId).orElseThrow {
            EntityNotFoundException("Appointment not found with id $appointmentId")
        }
        emailService.sendMail(
            emailMessageFactory.createAppointmentCancelledEmail(appointment, customerCancelled)
        )
    }

    override fun getAppointmentsForCustomer(customerId: Long): List<AppointmentDTO> {
        return appointmentRepository.findByCustomerId(customerId).map { mapToDTO(it) }
    }

    override fun getAppointmentsForProvider(providerId: Long): List<AppointmentDTO> {
        val provider = providerRepository.findByUserId(providerId).orElseThrow()
        return appointmentRepository.findByProviderId(provider.id!!).map { mapToDTO(it) }
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
        val providerAppointments = mutableMapOf<Long, MutableList<Appointment>>()
        appointmentRepository.findByDate(nextDay).forEach {
            if (it.customer.sendDailyAppointmentNotification && it.customer.email != null) {
                emailService.sendMail(
                    emailMessageFactory.createAppointmentNotificationEmail(appointment = it)
                )
            }
            if (it.provider.sendDailyAppointmentReport && it.provider.user.email != null) {
                if (providerAppointments[it.provider.id] != null) {
                    providerAppointments[it.provider.id]!!.add(it)
                } else {
                    providerAppointments[it.provider.id!!] = mutableListOf(it)
                }
            }
        }
        providerAppointments.forEach {
            val mail = emailMessageFactory.createAppointmentReportEmail(it.value)
            if (mail != null) {
                emailService.sendMail(mail)
            }
        }
    }
}