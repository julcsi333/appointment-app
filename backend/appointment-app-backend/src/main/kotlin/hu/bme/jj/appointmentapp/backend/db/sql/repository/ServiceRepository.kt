package hu.bme.jj.appointmentapp.backend.db.sql.repository

import hu.bme.jj.appointmentapp.backend.db.sql.model.MainService
import org.springframework.data.jpa.repository.JpaRepository

interface ServiceRepository : JpaRepository<MainService, Long>