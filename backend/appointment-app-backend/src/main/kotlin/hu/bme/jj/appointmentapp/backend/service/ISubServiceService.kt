package hu.bme.jj.appointmentapp.backend.service

import hu.bme.jj.appointmentapp.backend.api.model.ServiceDTO
import hu.bme.jj.appointmentapp.backend.api.model.SubServiceDTO

interface ISubServiceService {
    fun getServiceById(id: Long): SubServiceDTO

    fun getServicesByMainServiceId(id: Long): List<SubServiceDTO>

    fun createService(service: SubServiceDTO, mainServiceId: Long): SubServiceDTO

    fun updateService(updatedService: SubServiceDTO): SubServiceDTO

    fun deleteService(id: Long)

    fun deleteServiceByMainServiceId(id: Long)
}