package hu.bme.jj.appointmentapp.backend.service

import hu.bme.jj.appointmentapp.backend.api.model.ServiceDTO
import hu.bme.jj.appointmentapp.backend.db.sql.model.MainService
import hu.bme.jj.appointmentapp.backend.db.sql.model.Provider
import hu.bme.jj.appointmentapp.backend.db.sql.repository.GlobalServiceRepository
import hu.bme.jj.appointmentapp.backend.db.sql.repository.ProviderRepository
import hu.bme.jj.appointmentapp.backend.db.sql.repository.ServiceRepository
import jakarta.persistence.EntityNotFoundException
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

    override fun createService(service: ServiceDTO, providerId: Long): ServiceDTO {
        return saveService(service, providerId)
    }

    private fun saveService(service: ServiceDTO, providerId: Long): ServiceDTO {
        return mapToDTO(
            repository.save(
                mapToEntity(service, providerId)
            )
        )
    }

    override fun updateService(updatedService: ServiceDTO): ServiceDTO {
        if (updatedService.id == null) {
            throw NullPointerException("Main service id null when updating")
        }
        val oldService = getServiceByIdFromRepositoryOrThrow(updatedService.id)
        return saveService(
            updatedService,
            oldService.provider.id!! // Provider in DB is not optional. This field cannot be null
        )
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
            mainService.globalService.name,
            mainService.description,
            subServiceService.getServicesByMainServiceId(
                mainService.id ?: throw NullPointerException("Main service id null when mapping to UI representation")
            ),
            globalServiceService.getGlobalServiceById(mainService.globalService.id!!) // Global service id is not optional in DB. This cannot be null
        )
    }

    fun mapToEntity(mainService: ServiceDTO, providerId: Long): MainService {
        return MainService(
            mainService.id,
            mainService.description,
            providerRepository.findById(providerId)
                .orElseThrow {EntityNotFoundException("Provider #$providerId for main service #${mainService.id} not found!")},
            globalServiceRepository.findById(mainService.globalService.id)
                .orElseThrow {EntityNotFoundException("Global service #${mainService.globalService.id} for main service #${mainService.id} not found!")},
        )
    }
}