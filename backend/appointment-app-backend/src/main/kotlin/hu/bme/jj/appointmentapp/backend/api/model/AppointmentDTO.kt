package hu.bme.jj.appointmentapp.backend.api.model

import java.time.LocalDate
import java.time.LocalTime

class AppointmentDTO(
    val id: Long?,
    val date: LocalDate,
    val startTime: LocalTime,
    val endTime: LocalTime,
    val customerId: Long,
    var providerId: Long,
    val subServiceId: Long,
    val subServiceName: String?,
)