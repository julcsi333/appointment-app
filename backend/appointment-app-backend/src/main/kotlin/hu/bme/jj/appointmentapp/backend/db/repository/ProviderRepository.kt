package hu.bme.jj.appointmentapp.backend.db.repository

import hu.bme.jj.appointmentapp.backend.db.model.Provider
import org.springframework.data.jpa.repository.JpaRepository

interface ProviderRepository : JpaRepository<Provider, Long>