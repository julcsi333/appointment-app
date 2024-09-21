package hu.bme.jj.appointmentapp.backend.api.model

import hu.bme.jj.appointmentapp.backend.db.sql.model.SubService

data class ServiceDTO(
    val id: Long,
    val name: String,
    val subServices: List<SubService> = listOf()
)