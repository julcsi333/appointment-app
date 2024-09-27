package hu.bme.jj.appointmentapp.backend.db.sql.repository

import hu.bme.jj.appointmentapp.backend.db.sql.model.SubService
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface SubServiceRepository : JpaRepository<SubService, Long> {
    fun findByServiceId(serviceId: Long): List<SubService>
}