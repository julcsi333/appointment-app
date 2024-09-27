package hu.bme.jj.appointmentapp.backend.service

import hu.bme.jj.appointmentapp.backend.api.model.SubServiceDTO

interface ISubServiceService {
    fun getServiceById(id: Long): SubServiceDTO

    fun getServicesByMainServiceId(id: Long): List<SubServiceDTO>

    fun updateService(updatedService: SubServiceDTO): SubServiceDTO

    fun deleteService(id: Long)

    fun deleteServiceByMainServiceId(id: Long)
}