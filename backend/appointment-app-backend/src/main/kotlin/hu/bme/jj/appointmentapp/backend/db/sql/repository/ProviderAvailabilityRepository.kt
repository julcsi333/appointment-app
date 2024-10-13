package hu.bme.jj.appointmentapp.backend.db.sql.repository

import hu.bme.jj.appointmentapp.backend.db.sql.model.Appointment
import hu.bme.jj.appointmentapp.backend.db.sql.model.ProviderAvailability
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface ProviderAvailabilityRepository: JpaRepository<ProviderAvailability, Long>{
    fun findByProviderId(providerId: Long): List<ProviderAvailability>

    fun findByProviderAvailabilityRuleId(paRuleId: Long): List<ProviderAvailability>

    fun findByDateLessThan(date: java.sql.Date): List<ProviderAvailability>

}