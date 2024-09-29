package hu.bme.jj.appointmentapp.backend.service

import hu.bme.jj.appointmentapp.backend.api.model.ServiceDTO
import hu.bme.jj.appointmentapp.backend.db.sql.model.MainService
import hu.bme.jj.appointmentapp.backend.db.sql.repository.GlobalServiceRepository
import hu.bme.jj.appointmentapp.backend.db.sql.repository.ProviderRepository
import hu.bme.jj.appointmentapp.backend.db.sql.repository.ServiceRepository
import jakarta.persistence.EntityExistsException
import jakarta.persistence.EntityNotFoundException
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service

@Service
class MainServiceService(
    private val repository: ServiceRepository,
    private val providerRepository: ProviderRepository,
    private val globalServiceRepository: GlobalServiceRepository,
    private val subServiceService: ISubServiceService,
    private val globalServiceService: IGlobalServiceService,
): IMainServiceService{

    //fun findAllServices(): List<ServiceDTO> = repository.findAll().map { mapToDTO(it) }
    @Throws(EntityNotFoundException::class)
    private fun getServiceByIdFromRepositoryOrThrow(id: Long): MainService {
        return getServiceByIdFromRepository(id) ?: throw EntityNotFoundException("Main service not found with id $id")
    }

    private fun getServiceByIdFromRepository(id: Long): MainService? {
        return repository.findById(id).orElse(null)
    }

    override fun getServiceById(id: Long): ServiceDTO {
        return mapToDTO(
            getServiceByIdFromRepositoryOrThrow(id)
        )
    }

    override fun getAllMainServices(): List<ServiceDTO> {
        return repository.findAll().map { mapToDTO(it) }
    }

    @Transactional
    @Throws(EntityExistsException::class)
    override fun createService(service: ServiceDTO): ServiceDTO {
        if (service.id != null && getServiceByIdFromRepository(service.id) != null)
            throw EntityExistsException("Main service with id #${service.id} already exists")

        val newService = saveService(service)
        service.subServices.forEach {
            subServiceService.createService(it, newService.id!!) // ID of main service from database cannot be null
        }
        return mapToDTO(getServiceByIdFromRepositoryOrThrow(newService.id!!)) // ID of main service from database cannot be null
    }

    private fun saveService(service: ServiceDTO): ServiceDTO {
        return mapToDTO(
            repository.save(
                mapToEntity(service)
            )
        )
    }

    @Transactional
    override fun updateService(updatedService: ServiceDTO): ServiceDTO {
        if (updatedService.id == null) {
            throw NullPointerException("Main service id null when updating")
        }
        val savedSubServiceIds = subServiceService.getServicesByMainServiceId(updatedService.id)
            .map {it.id!!}.toMutableList() // Services from database cannot have null id
        updatedService.subServices.forEach {
            if (it.id == null) {
                subServiceService.createService(it, updatedService.id)
            } else if (savedSubServiceIds.contains(it.id)) {
                subServiceService.updateService(it)
                savedSubServiceIds.remove(it.id)
            } else {
                throw IllegalArgumentException("New sub service cannot be added with non-null id")
            }
        }
        savedSubServiceIds.forEach {
            subServiceService.deleteService(it)
        }
        return saveService(updatedService)
    }

    override fun deleteService(id: Long) {
        subServiceService.deleteServiceByMainServiceId(id)
        repository.deleteById(id)
        // TODO: call mongodb to delete related pictures
    }

    override fun getServicesByProviderId(id: Long): List<ServiceDTO> {
        return repository.findByProviderId(id).map { mapToDTO(it) }
    }

    override fun deleteServicesByProviderId(id: Long) {
        val servicesToDelete = repository.findByProviderId(id)
        servicesToDelete.forEach {
            deleteService(it.id!!)
        }
    }

    fun mapToDTO(mainService: MainService): ServiceDTO {
        return ServiceDTO(
            mainService.id,
            mainService.description,
            subServiceService.getServicesByMainServiceId(
                mainService.id ?: throw NullPointerException("Main service id null when mapping to UI representation")
            ),
            globalServiceService.getGlobalServiceById(mainService.globalService.id!!), // Global service id is not optional in DB. This cannot be null
            mainService.provider.id!! // Provider id is not optional in DB. This cannot be null
        )
    }

    fun mapToEntity(mainService: ServiceDTO): MainService {
        return MainService(
            mainService.id,
            mainService.description,
            providerRepository.findByUserId(mainService.providerId)
                .orElseThrow {EntityNotFoundException("Provider #${mainService.providerId} for main service #${mainService.id} not found!")},
            globalServiceRepository.findById(mainService.globalService.id)
                .orElseThrow {EntityNotFoundException("Global service #${mainService.globalService.id} for main service #${mainService.id} not found!")},
        )
    }
}