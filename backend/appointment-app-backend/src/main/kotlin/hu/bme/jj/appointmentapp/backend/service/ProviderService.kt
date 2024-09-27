package hu.bme.jj.appointmentapp.backend.service

import hu.bme.jj.appointmentapp.backend.api.model.ProviderDTO
import hu.bme.jj.appointmentapp.backend.api.model.ServiceDTO
import hu.bme.jj.appointmentapp.backend.db.sql.model.Provider
import hu.bme.jj.appointmentapp.backend.db.sql.repository.ProviderRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.stereotype.Service

@Service
class ProviderService(
    private val repository: ProviderRepository,
    private val mainServiceService: IMainServiceService
) : IProviderService {

    private fun existsById(id: Long): Boolean {
        return repository.existsById(id)
    }

    private fun getProviderByIdFromRepositoryOrThrow(id: Long): Provider {
        return repository.findById(id).orElseThrow { EntityNotFoundException("Provider not found with id $id") }
    }

    private fun getProviderByIdFromRepository(id: Long): Provider? {
        return repository.findById(id).orElse(null)
    }

    private fun mapToDTOOptional(provider: Provider?): ProviderDTO? = if (provider != null) {
        mapToDTO(provider)
    } else {
        null
    }

    private fun mapToDTO(provider: Provider): ProviderDTO = ProviderDTO(
        provider.id,
        provider.name,
        provider.phoneNumber,
        provider.email,
        provider.bio ?: "",
        provider.businessAddress,
        mainServiceService.getServicesByProviderId(
            provider.id ?: throw NullPointerException("Provider id null when mapping to UI representation")
        )
    )

    private fun mapToEntity(provider: ProviderDTO): Provider = Provider(
        provider.id,
        provider.name,
        provider.phoneNumber,
        provider.email,
        provider.bio ?: "",
        provider.businessAddress
    )

    override fun getAllProviders(): List<ProviderDTO> {
        return repository.findAll().map { mapToDTO(it) }
    }

    override fun getProviderById(id: Long): ProviderDTO {
        return mapToDTO(getProviderByIdFromRepositoryOrThrow(id))
    }

    override fun tryGetProviderById(id: Long): ProviderDTO? {
        return mapToDTOOptional(getProviderByIdFromRepository(id))
    }

    override fun updateProvider(updatedProvider: ProviderDTO): ProviderDTO {
        if (updatedProvider.id == null || !repository.existsById(updatedProvider.id)) {
            throw EntityNotFoundException("Provider not found with id ${updatedProvider.id}")
        }
        var updatedProviderEntity = mapToEntity(updatedProvider)
        updatedProviderEntity = repository.save(updatedProviderEntity)

        return mapToDTO(updatedProviderEntity)
    }

    override fun createProvider(provider: ProviderDTO): ProviderDTO {
        return mapToDTO(repository.save(mapToEntity(provider)))
    }

    override fun deleteProvider(id: Long) {
        mainServiceService.deleteServicesByProviderId(id)
        repository.deleteById(id)
    }
}