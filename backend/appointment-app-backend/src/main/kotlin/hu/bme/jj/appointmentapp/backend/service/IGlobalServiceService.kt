package hu.bme.jj.appointmentapp.backend.service

import hu.bme.jj.appointmentapp.backend.api.model.GlobalServiceDTO

interface IGlobalServiceService {
    fun getAllGlobalServices(): List<GlobalServiceDTO>

    fun getGlobalServiceById(id: Long): GlobalServiceDTO
}