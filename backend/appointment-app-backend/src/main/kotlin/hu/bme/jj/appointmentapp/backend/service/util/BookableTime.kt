package hu.bme.jj.appointmentapp.backend.service.util

import hu.bme.jj.appointmentapp.backend.api.model.BookableTimeDTO
import java.time.Duration
import java.time.LocalDate
import java.time.LocalTime
import java.time.Period

data class BookableTime (
    val date: LocalDate,
    val from: LocalTime,
    val to: LocalTime
) {

    //val fmt: SimpleDateFormat = SimpleDateFormat("yyyyMMdd")

    fun subtractTimeFromBookable(date: LocalDate, start: LocalTime, end: LocalTime, bookTimeMinutes: Long): List<BookableTime> {
        val result: MutableList<BookableTime> = mutableListOf()
        if (!Period.between(this.date, date).isZero || end.isBefore(from) || start.isAfter(to)) {
            result.add(this)
            return result
        }
        if (start.isBefore(to) && start.isAfter(from) && Duration.between(from, start).toMinutes() > bookTimeMinutes) {
            result.add(BookableTime(this.date, from, start))
        }
        if (end.isBefore(to) && end.isAfter(from) && Duration.between(end, to).toMinutes() > bookTimeMinutes) {
            result.add(BookableTime(this.date, end, to))
        }
        return result
    }

    fun getBookableTimes(bookTimeMinutes: Long): List<BookableTimeDTO> {
        val result: MutableList<BookableTimeDTO> = mutableListOf()
        var bookStartTime = from
        while (Duration.between(bookStartTime, to).toMinutes() >= bookTimeMinutes) {
            result.add(BookableTimeDTO(this.date, bookStartTime))
            bookStartTime = bookStartTime.plusMinutes(bookTimeMinutes)
        }
        return result
    }
}