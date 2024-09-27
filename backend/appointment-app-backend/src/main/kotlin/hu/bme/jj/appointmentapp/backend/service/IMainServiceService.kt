package hu.bme.jj.appointmentapp.backend.service

import hu.bme.jj.appointmentapp.backend.api.model.ServiceDTO

interface IMainServiceService {
    fun createService(service: ServiceDTO, providerId: Long): ServiceDTO

    fun updateService(updatedService: ServiceDTO): ServiceDTO

    fun deleteService(id: Long)

    fun deleteServicesByProviderId(id: Long)

    fun getServicesByProviderId(id: Long): List<ServiceDTO>

    fun getServiceById(id: Long): ServiceDTO
}