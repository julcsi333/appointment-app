package hu.bme.jj.appointmentapp.backend.api.model

import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime

data class ProviderAvailabilityRuleDTO (
    val id: Long? = null,
    val providerId: Long,
    val start: LocalDateTime,
    val end: LocalDateTime,
    val repeatMonthCount: Long = 0
)