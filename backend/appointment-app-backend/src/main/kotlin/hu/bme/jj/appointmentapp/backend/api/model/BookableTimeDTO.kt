package hu.bme.jj.appointmentapp.backend.api.model

import java.time.LocalDate
import java.time.LocalTime

data class BookableTimeDTO (
    val date: LocalDate,
    val time: LocalTime
)