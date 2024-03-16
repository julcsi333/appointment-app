package hu.bme.jj.appointmentapp.backend.db.repository

import hu.bme.jj.appointmentapp.backend.db.model.Service
import org.springframework.data.jpa.repository.JpaRepository

interface ServiceRepository : JpaRepository<Service, Long>