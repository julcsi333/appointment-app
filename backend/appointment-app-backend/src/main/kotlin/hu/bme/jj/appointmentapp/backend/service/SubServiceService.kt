package hu.bme.jj.appointmentapp.backend.service

import hu.bme.jj.appointmentapp.backend.api.model.ProviderDTO
import hu.bme.jj.appointmentapp.backend.api.model.SubServiceDTO
import hu.bme.jj.appointmentapp.backend.db.mongo.ImageService
import hu.bme.jj.appointmentapp.backend.db.sql.model.Provider
import hu.bme.jj.appointmentapp.backend.db.sql.model.SubService
import hu.bme.jj.appointmentapp.backend.db.sql.repository.SubServiceRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.stereotype.Service

@Service
class SubServiceService(private val repository: SubServiceRepository, private val imageService: ImageService) {
    fun findAllSubServices(): List<SubService> = repository.findAll()
    fun saveService(service: SubService): SubService = repository.save(service)

    fun getServiceById(id: Long): SubService {
        return repository.findById(id).orElseThrow { EntityNotFoundException("Sub service not found with id $id") }
    }

    fun getServicesByMainServiceId(id: Long): List<SubService> {
        return repository.findByServiceId(id)
    }

    fun getServicesByProviderId(id: Long): List<SubService> {
        return repository.findByProviderId(id)
    }

    fun updateService(id: Long, updatedService: SubService): SubService {
        if (!repository.existsById(id)) {
            throw EntityNotFoundException("Sub service not found with id $id")
        }
        updatedService.id = id
        return repository.save(updatedService)
    }

    fun deleteServiceByMainServiceId(id: Long) {
        val servicesToDelete = getServicesByMainServiceId(id)
        servicesToDelete.forEach {
            deleteService(it.id)
        }
    }

    fun deleteServiceByProviderId(id: Long) {
        val servicesToDelete = getServicesByProviderId(id)
        servicesToDelete.forEach {
            deleteService(it.id)
        }
    }

    fun deleteServiceByMainServiceIdAndProviderId(mainServiceId: Long, providerId: Long) {
        val servicesToDelete = getServicesByProviderId(providerId)
        servicesToDelete.forEach {
            if(it.mainService.id == mainServiceId) {
                deleteService(it.id)
            }
        }
    }

    fun deleteService(id: Long) {
        repository.deleteById(id)
        // TODO: call mongodb to delete related pictures
    }

    fun mapToDTO(subService: SubService): SubServiceDTO {
        return SubServiceDTO(subService.id, subService.name, subService.duration, subService.price, listOf("subService" + subService.id.toString()))
    }
}