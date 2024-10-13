package hu.bme.jj.appointmentapp.backend.db.sql.repository

import hu.bme.jj.appointmentapp.backend.db.sql.model.Appointment
import hu.bme.jj.appointmentapp.backend.db.sql.model.Provider
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface AppointmentRepository : JpaRepository<Appointment, Long> {
    fun findByCustomerId(customerId: Long): List<Appointment>
    fun findByProviderId(providerId: Long): List<Appointment>
    fun findByProviderIdAndDateGreaterThan(providerId: Long, date: java.sql.Date): List<Appointment>

    fun findByDate(date: java.sql.Date): List<Appointment>
}