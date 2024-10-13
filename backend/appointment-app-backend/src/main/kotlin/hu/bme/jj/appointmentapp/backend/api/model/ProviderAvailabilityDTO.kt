package hu.bme.jj.appointmentapp.backend.api.model

import java.time.LocalDate
import java.time.LocalTime


data class ProviderAvailabilityDTO (
    val id: Long? = null,
    val providerId: Long,
    val date: LocalDate,
    val startTime: LocalTime,
    val endTime: LocalTime,
    val ruleId: Long? = null
)