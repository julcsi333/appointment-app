package hu.bme.jj.appointmentapp.backend.db.sql.repository

import hu.bme.jj.appointmentapp.backend.db.sql.model.GlobalService
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface GlobalServiceRepository : JpaRepository<GlobalService, Long>