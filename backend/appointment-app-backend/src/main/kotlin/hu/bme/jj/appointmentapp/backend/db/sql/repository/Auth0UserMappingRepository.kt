package hu.bme.jj.appointmentapp.backend.db.sql.repository

import hu.bme.jj.appointmentapp.backend.db.sql.model.Auth0UserMapping
import org.springframework.data.jpa.repository.JpaRepository


interface Auth0UserMappingRepository : JpaRepository<Auth0UserMapping, Long> {
    fun findByAuth0UserId(auth0UserId: String): Auth0UserMapping?
}