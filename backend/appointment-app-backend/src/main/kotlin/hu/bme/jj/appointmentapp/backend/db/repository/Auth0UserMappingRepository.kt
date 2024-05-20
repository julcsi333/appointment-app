package hu.bme.jj.appointmentapp.backend.db.repository

import hu.bme.jj.appointmentapp.backend.db.model.Auth0UserMapping
import org.springframework.data.jpa.repository.JpaRepository


interface Auth0UserMappingRepository : JpaRepository<Auth0UserMapping, Long> {
    fun findByAuth0UserId(auth0UserId: String): Auth0UserMapping?
}