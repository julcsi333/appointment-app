package hu.bme.jj.appointmentapp.backend.services.service

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
): IMainServiceService {

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

    /*fun getServicesByGlobalServiceId(id: Long): List<ServiceDTO> {
        return repository.findByGlobalServiceId(id).map { mapToDTO(it) }
    }*/

    @Transactional
    @Throws(EntityExistsException::class)
    override fun createService(service: ServiceDTO): ServiceDTO {
        if (service.id != null && getServiceByIdFromRepository(service.id) != null)
            throw EntityExistsException("Main service with id #${service.id} already exists")

        val newService = saveService(service)
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
        return saveService(updatedService)
    }

    override fun deleteService(id: Long) {
        subServiceService.deleteServiceByMainServiceId(id)
        repository.deleteById(id)
        // TODO: call mongodb to delete related pictures
    }

    override fun getServicesByProviderId(id: Long): List<ServiceDTO> {
        val provider = providerRepository.findByUserId(id).orElseThrow {
            EntityNotFoundException("No provider found with userid #$id")
        }
        return repository.findByProviderId(
            provider.id!!   // Id is not an optional field in database. This must not be null
        ).map { mapToDTO(it) }
    }

    override fun deleteServicesByProviderId(id: Long) {
        val servicesToDelete = repository.findByProviderId(id)
        servicesToDelete.forEach {
            deleteService(it.id!!)
        }
    }

    private fun mapToDTO(mainService: MainService): ServiceDTO {
        return ServiceDTO(
            mainService.id,
            mainService.description,
            subServiceService.getServicesByMainServiceId(
                mainService.id ?: throw NullPointerException("Main service id null when mapping to UI representation")
            ),
            globalServiceService.getGlobalServiceById(mainService.globalService.id!!), // Global service id is not optional in DB. This cannot be null
            mainService.provider.user.id!! // Id is not optional in DB. This cannot be null
        )
    }

    private fun mapToEntity(mainService: ServiceDTO): MainService {
        return if (mainService.id != null) {
            val entity = repository.findById(mainService.id).orElseThrow()
            MainService(
                mainService.id,
                mainService.description,
                entity.provider,
                entity.globalService,
                entity.subServices
            )
        } else {
            MainService(
                null,
                mainService.description,
                providerRepository.findByUserId(mainService.providerId)
                    .orElseThrow {EntityNotFoundException("Provider #${mainService.providerId} for new main service not found!")},
                globalServiceRepository.findById(mainService.globalService.id)
                    .orElseThrow {EntityNotFoundException("Global service #${mainService.globalService.id} for new main service not found!")},
            )
        }
    }
}