package hu.bme.jj.appointmentapp.backend.db.sql.repository

import hu.bme.jj.appointmentapp.backend.db.sql.model.Provider
import org.springframework.data.jpa.repository.JpaRepository

interface ProviderRepository : JpaRepository<Provider, Long> {
    // Try to put the getProviderOrThrow here
}