package hu.bme.jj.appointmentapp.backend.service

import hu.bme.jj.appointmentapp.backend.api.model.ProviderAvailabilityRuleDTO
import hu.bme.jj.appointmentapp.backend.db.sql.model.ProviderAvailability
import hu.bme.jj.appointmentapp.backend.db.sql.model.ProviderAvailabilityRule
import hu.bme.jj.appointmentapp.backend.db.sql.repository.ProviderAvailabilityRepository
import hu.bme.jj.appointmentapp.backend.db.sql.repository.ProviderAvailabilityRuleRepository
import hu.bme.jj.appointmentapp.backend.db.sql.repository.ProviderRepository
import jakarta.persistence.EntityExistsException
import jakarta.persistence.EntityNotFoundException
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.temporal.TemporalAdjusters

@Service
class ProviderAvailabilityRuleService(
    private val repository: ProviderAvailabilityRuleRepository,
    private val providerAvailabilityRepository: ProviderAvailabilityRepository,
    private val providerRepository: ProviderRepository,
): IProviderAvailabilityRuleService {

    @Throws(EntityNotFoundException::class)
    private fun getPARuleByIdFromRepositoryOrThrow(id: Long): ProviderAvailabilityRule {
        return getPARuleByIdFromRepository(id) ?: throw EntityNotFoundException("Provider availability rule not found with id $id")
    }

    private fun getPARuleByIdFromRepository(id: Long): ProviderAvailabilityRule? {
        return repository.findById(id).orElse(null)
    }

    override fun updatePARule(updatedPARule: ProviderAvailabilityRuleDTO): ProviderAvailabilityRuleDTO {
        if (updatedPARule.id == null) {
            throw NullPointerException("Provider availability rule id null when updating")
        }
        val updatedPaRule = repository.save(
            mapToEntity(updatedPARule)
        )
        deleteEventsForRule(updatedPaRule.id!!)
        addEventsForRule(updatedPaRule)
        return mapToDTO(updatedPaRule)
    }

    override fun createPARule(paRule: ProviderAvailabilityRuleDTO): ProviderAvailabilityRuleDTO {
        if (paRule.id != null && getPARuleByIdFromRepository(paRule.id) != null)
            throw EntityExistsException("Provider availability rule with id #${paRule.id} already exists")
        val paRuleEntity = repository.save(
            mapToEntity(paRule)
        )
        addEventsForRule(paRuleEntity)

        return mapToDTO(paRuleEntity)
    }

    /**
     * Add new availability events for the next months based on the given [paRule]
     */
    fun addEventsForRule(paRule: ProviderAvailabilityRule) {
        val ruleEndDate = LocalDate.now().plusDays(paRule.repeatMonthCount*30)
        val dayOfWeek = paRule.date.toLocalDate().dayOfWeek
        // The next day of week (e.g. Monday) from today (or today if today is Monday).
        var availabilityEvent = LocalDate.now().with(TemporalAdjusters.nextOrSame(dayOfWeek))
        while (availabilityEvent <= ruleEndDate) {
            availabilityEvent = availabilityEvent.with(TemporalAdjusters.next(dayOfWeek))
            providerAvailabilityRepository.save(
                ProviderAvailability(
                    null,
                    paRule.provider,
                    java.sql.Date.valueOf(availabilityEvent),
                    paRule.startTime,
                    paRule.endTime,
                    paRule
                )
            )
        }
    }

    fun deleteEventsForRule(paRuleId: Long) {
        providerAvailabilityRepository.deleteAllById(
            providerAvailabilityRepository.findByProviderAvailabilityRuleId(paRuleId).map { it.id }
        )
    }

    override fun getAllPARules(): List<ProviderAvailabilityRuleDTO> {
        return repository.findAll().map { mapToDTO(it) }
    }

    /**
     * Adds new availability events for the providers based on the current rules in the database.
     */
    @Scheduled(cron = "0 1 0 * * *")
    fun updateAvailabilityEventsByRules() {
        val currentDate = LocalDate.now()
        val currentDayOfWeek = currentDate.dayOfWeek
        repository.findAll().forEach {
            // If the rule is for this day of week e.g. Mondays
            if (it.date.toLocalDate().dayOfWeek == currentDayOfWeek) {
                // The next date after x months that is the same day of the week as the rule
                val newAvailabilityDate = currentDate.plusDays(it.repeatMonthCount*30)
                    .with(TemporalAdjusters.nextOrSame(currentDayOfWeek))
                providerAvailabilityRepository.save(
                    ProviderAvailability(
                        null,
                        it.provider,
                        java.sql.Date.valueOf(newAvailabilityDate),
                        it.startTime,
                        it.endTime,
                        it
                    )
                )
            }
        }
    }

    override fun getPARuleById(id: Long): ProviderAvailabilityRuleDTO = mapToDTO(getPARuleByIdFromRepositoryOrThrow(id))
    override fun getPARulesByProviderId(id: Long): List<ProviderAvailabilityRuleDTO> {
        return repository.findByProviderId(id).map { mapToDTO(it) }
    }

    override fun deletePARule(id: Long) {
        deleteEventsForRule(id)
        repository.deleteById(id)
    }

    private fun mapToDTO(pa: ProviderAvailabilityRule): ProviderAvailabilityRuleDTO {
        return ProviderAvailabilityRuleDTO(
            pa.id,
            pa.provider.id ?: throw NullPointerException("Provider id null when mapping to UI representation"),
            pa.date.toLocalDate(),
            pa.startTime.toLocalTime(),
            pa.endTime.toLocalTime(),
            pa.repeatMonthCount
        )
    }

    private fun mapToEntity(pa: ProviderAvailabilityRuleDTO): ProviderAvailabilityRule {
        return ProviderAvailabilityRule(
            pa.id,
            providerRepository.findByUserId(pa.providerId).orElseThrow {
                EntityNotFoundException("Provider #${pa.providerId} for availability rule #${pa.id} not found!")
            },
            java.sql.Date.valueOf(pa.date),
            java.sql.Time.valueOf(pa.startTime),
            java.sql.Time.valueOf(pa.endTime),
            pa.repeatMonthCount
        )
    }

}