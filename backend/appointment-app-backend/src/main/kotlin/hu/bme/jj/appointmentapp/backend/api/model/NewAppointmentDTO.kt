package hu.bme.jj.appointmentapp.backend.api.model

import java.time.LocalDateTime

data class NewAppointmentDTO (
    val id: Long?,
    val date: LocalDateTime,
    val customerId: Long,
    var providerId: Long,
    val subServiceId: Long
)