package hu.bme.jj.appointmentapp.backend.db.sql.repository

import hu.bme.jj.appointmentapp.backend.db.sql.model.ProviderAvailabilityRule
import org.springframework.data.jpa.repository.JpaRepository

interface ProviderAvailabilityRuleRepository: JpaRepository<ProviderAvailabilityRule, Long>{
    fun findByProviderId(providerId: Long): List<ProviderAvailabilityRule>
}