package hu.bme.jj.appointmentapp.backend.services.provider

import hu.bme.jj.appointmentapp.backend.api.model.BookableTimeDTO
import hu.bme.jj.appointmentapp.backend.model.BookableTime
import hu.bme.jj.appointmentapp.backend.api.model.ProviderAvailabilityDTO
import hu.bme.jj.appointmentapp.backend.db.sql.model.ProviderAvailability
import hu.bme.jj.appointmentapp.backend.db.sql.repository.ProviderAvailabilityRepository
import hu.bme.jj.appointmentapp.backend.db.sql.repository.ProviderAvailabilityRuleRepository
import hu.bme.jj.appointmentapp.backend.db.sql.repository.ProviderRepository
import hu.bme.jj.appointmentapp.backend.services.appointment.AppointmentService
import jakarta.persistence.EntityExistsException
import jakarta.persistence.EntityNotFoundException
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.time.LocalDate

@Service
class ProviderAvailabilityService(
    private val repository: ProviderAvailabilityRepository,
    private val ruleRepository: ProviderAvailabilityRuleRepository,
    private val providerRepository: ProviderRepository,
    private val appointmentService: AppointmentService,
): IProviderAvailabilityService {

    @Throws(EntityNotFoundException::class)
    private fun getPAByIdFromRepositoryOrThrow(id: Long): ProviderAvailability {
        return getPAByIdFromRepository(id) ?: throw EntityNotFoundException("Provider availability not found with id $id")
    }

    private fun getPAByIdFromRepository(id: Long): ProviderAvailability? {
        return repository.findById(id).orElse(null)
    }

    override fun updatePA(updatedPA: ProviderAvailabilityDTO): ProviderAvailabilityDTO {
        if (updatedPA.id == null) {
            throw NullPointerException("Provider availability id null when updating")
        }
        return mapToDTO(
            repository.save(
                mapToEntity(updatedPA)
            )
        )
    }

    override fun createPA(providerAvailability: ProviderAvailabilityDTO): ProviderAvailabilityDTO {
        if (providerAvailability.id != null && getPAByIdFromRepository(providerAvailability.id) != null)
            throw EntityExistsException("Provider availability with id #${providerAvailability.id} already exists")
        return mapToDTO(
            repository.save(
                mapToEntity(providerAvailability)
            )
        )
    }

    override fun getAllPAs(): List<ProviderAvailabilityDTO> {
        return repository.findAll().map { mapToDTO(it) }
    }

    override fun getPAById(id: Long): ProviderAvailabilityDTO = mapToDTO(getPAByIdFromRepositoryOrThrow(id))
    override fun getPAsByProviderId(id: Long): List<ProviderAvailabilityDTO> {
        return repository.findByProviderId(id).map { mapToDTO(it) }
    }

    override fun getBookablePAsByProviderId(id: Long, bookTimeMinutes: Long): List<BookableTimeDTO> {
        var bookableTimes = repository.findByProviderId(id).map { BookableTime(it.date.toLocalDate(), it.startTime.toLocalTime(), it.endTime.toLocalTime()) }.toMutableList()
        appointmentService.getAppointmentsForProviderAfter(id, LocalDate.now()).forEach { appointment ->
            val newBookableTimes = mutableListOf<BookableTime>()
            bookableTimes.forEach { bookableTime ->
                newBookableTimes.addAll(
                    bookableTime.subtractTimeFromBookable(appointment.date, appointment.startTime, appointment.endTime, bookTimeMinutes)
                )
            }
            bookableTimes = newBookableTimes
        }
        val result = mutableListOf<BookableTimeDTO>()
        bookableTimes.map { result.addAll(it.getBookableTimes(bookTimeMinutes)) }
        return result
    }

    override fun deletePA(id: Long) {
        repository.deleteById(id)
    }

    private fun mapToDTO(pa: ProviderAvailability): ProviderAvailabilityDTO {
        return ProviderAvailabilityDTO(
            pa.id,
            pa.provider.id ?: throw NullPointerException("Provider id null when mapping to UI representation"),
            pa.date.toLocalDate(),
            pa.startTime.toLocalTime(),
            pa.endTime.toLocalTime(),
            pa.providerAvailabilityRule?.id
        )
    }

    private fun mapToEntity(pa: ProviderAvailabilityDTO): ProviderAvailability {
        return ProviderAvailability(
            pa.id,
            providerRepository.findByUserId(pa.providerId).orElseThrow {
                EntityNotFoundException("Provider #${pa.providerId} for availability #${pa.id} not found!")
            },
            java.sql.Date.valueOf(pa.date),
            java.sql.Time.valueOf(pa.startTime),
            java.sql.Time.valueOf(pa.endTime),
            if(pa.ruleId != null) ruleRepository.findById(pa.ruleId).orElse(null) else null
        )
    }

    /**
     * Delete outdated availability events. No need to keep availability for past days.
     */
    @Scheduled(cron = "0 1 0 * * *")
    fun deletePastAvailability() {
        val availabilitiesToDelete = repository.findByDateLessThan(java.sql.Date.valueOf(LocalDate.now())).map { it.id }
        repository.deleteAllById(availabilitiesToDelete)
    }
}