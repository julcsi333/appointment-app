package hu.bme.jj.appointmentapp.backend.services.service

import hu.bme.jj.appointmentapp.backend.api.model.ServiceDTO

interface IMainServiceService {
    fun getAllMainServices(): List<ServiceDTO>

    //fun getServicesByGlobalServiceId(id: Long): List<ServiceDTO>

    fun createService(service: ServiceDTO): ServiceDTO

    fun updateService(updatedService: ServiceDTO): ServiceDTO

    fun deleteService(id: Long)

    fun deleteServicesByProviderId(id: Long)

    fun getServicesByProviderId(id: Long): List<ServiceDTO>

    fun getServiceById(id: Long): ServiceDTO
}