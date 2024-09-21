package hu.bme.jj.appointmentapp.backend.service

import hu.bme.jj.appointmentapp.backend.db.sql.model.MainService
import hu.bme.jj.appointmentapp.backend.db.sql.model.UserData
import hu.bme.jj.appointmentapp.backend.db.sql.repository.ServiceRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.stereotype.Service

@Service
class MainServiceService(private val repository: ServiceRepository, private val subServiceService: SubServiceService) {

    fun findAllServices(): List<MainService> = repository.findAll()
    fun saveService(service: MainService): MainService = repository.save(service)

    fun getServiceById(id: Long): MainService {
        return repository.findById(id).orElseThrow { EntityNotFoundException("Main service not found with id $id") }
    }

    fun updateService(id: Long, updatedService: MainService): MainService {
        if (!repository.existsById(id)) {
            throw EntityNotFoundException("Main service not found with id $id")
        }
        updatedService.id = id
        return repository.save(updatedService)
    }

    fun deleteService(id: Long) {
        subServiceService.deleteServiceByMainServiceId(id)
        repository.deleteById(id)
    }
}