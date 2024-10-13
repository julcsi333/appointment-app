package hu.bme.jj.appointmentapp.backend.services.service

import hu.bme.jj.appointmentapp.backend.api.model.SubServiceDTO
import hu.bme.jj.appointmentapp.backend.db.sql.model.SubService
import hu.bme.jj.appointmentapp.backend.db.sql.repository.ServiceRepository
import hu.bme.jj.appointmentapp.backend.db.sql.repository.SubServiceRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.stereotype.Service

@Service
class SubServiceService(
    private val repository: SubServiceRepository,
    private val mainServiceRepository: ServiceRepository
) : ISubServiceService {

    @Throws(EntityNotFoundException::class)
    private fun getServiceByIdFromRepositoryOrThrow(id: Long): SubService {
        return getServiceByIdFromRepository(id) ?: throw EntityNotFoundException("Sub service not found with id $id")
    }

    private fun getServiceByIdFromRepository(id: Long): SubService? {
        return repository.findById(id).orElse(null)
    }

    override fun getServiceById(id: Long): SubServiceDTO {
        return mapToDTO(
            getServiceByIdFromRepositoryOrThrow(id)
        )
    }

    override fun getServicesByMainServiceId(id: Long): List<SubServiceDTO> {
        return repository.findByMainServiceId(id).map { mapToDTO(it) }
    }

    override fun createService(service: SubServiceDTO, mainServiceId: Long): SubServiceDTO {
        return mapToDTO(
            repository.save(
                mapToEntity(service, mainServiceId)
            )
        )
    }

    override fun updateService(updatedService: SubServiceDTO): SubServiceDTO {
        if (updatedService.id == null) {
            throw NullPointerException("Sub service id null when updating")
        }
        val oldService = getServiceByIdFromRepositoryOrThrow(updatedService.id)
        val updatedServiceEntity = mapToEntity(
            updatedService,
            oldService.mainService.id!! // Main service in DB is not optional. This field cannot be null
        )
        return mapToDTO(repository.save(updatedServiceEntity))
    }

    override fun deleteServiceByMainServiceId(id: Long) {
        val servicesToDelete = repository.findByMainServiceId(id)
        servicesToDelete.forEach {
            deleteService(it.id!!) // SubService id from DB cannot be null.
        }
    }

    override fun deleteService(id: Long) {
        repository.deleteById(id)
    }

    fun mapToDTO(subService: SubService): SubServiceDTO {
        return SubServiceDTO(subService.id, subService.name, subService.duration, subService.price)
    }

    fun mapToEntity(subService: SubServiceDTO, mainServiceId: Long): SubService {
        return SubService(
            subService.id,
            subService.name,
            subService.duration,
            subService.price,
            mainServiceRepository.findById(mainServiceId)
                .orElseThrow {EntityNotFoundException("Main service #$mainServiceId for subservice #${subService.id} not found!")},
        )
    }
}