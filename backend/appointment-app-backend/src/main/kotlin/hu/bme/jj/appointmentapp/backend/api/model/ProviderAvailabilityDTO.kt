package hu.bme.jj.appointmentapp.backend.api.model

import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime


data class ProviderAvailabilityDTO (
    val id: Long? = null,
    val providerId: Long,
    val start: LocalDateTime,
    val end: LocalDateTime,
    val ruleId: Long? = null
)