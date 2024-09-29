package hu.bme.jj.appointmentapp.backend.db.sql.repository

import hu.bme.jj.appointmentapp.backend.db.sql.model.MainService
import hu.bme.jj.appointmentapp.backend.db.sql.model.Provider
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface ProviderRepository : JpaRepository<Provider, Long> {
    // Try to put the getProviderOrThrow here
    fun findByUserId(userId: Long): Optional<Provider>
}