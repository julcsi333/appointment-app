package hu.bme.jj.appointmentapp.backend.db.sql.repository

import hu.bme.jj.appointmentapp.backend.db.sql.model.MainService
import hu.bme.jj.appointmentapp.backend.db.sql.model.SubService
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ServiceRepository : JpaRepository<MainService, Long> {
    fun findByProviderId(providerId: Long): List<MainService>


    fun findByGlobalServiceId(globalServiceId: Long): List<MainService>
}