package hu.bme.jj.appointmentapp.backend.services.service

import hu.bme.jj.appointmentapp.backend.api.model.SubServiceDTO

interface ISubServiceService {
    fun getServiceById(id: Long): SubServiceDTO

    fun getServicesByMainServiceId(id: Long): List<SubServiceDTO>

    fun getServicesByName(name: String, globalServiceId: Long): List<SubServiceDTO>

    fun getSubServiceNamesByGlobalServiceId(globalServiceId: Long): List<String>

    fun createService(service: SubServiceDTO, mainServiceId: Long): SubServiceDTO

    fun updateService(updatedService: SubServiceDTO): SubServiceDTO

    fun deleteService(id: Long)

    fun deleteServiceByMainServiceId(id: Long)
}