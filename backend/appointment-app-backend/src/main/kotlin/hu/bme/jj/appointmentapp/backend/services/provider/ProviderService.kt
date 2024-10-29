package hu.bme.jj.appointmentapp.backend.services.provider

import hu.bme.jj.appointmentapp.backend.api.model.ProviderDTO
import hu.bme.jj.appointmentapp.backend.db.sql.model.Provider
import hu.bme.jj.appointmentapp.backend.db.sql.repository.ProviderRepository
import hu.bme.jj.appointmentapp.backend.db.sql.repository.UserRepository
import hu.bme.jj.appointmentapp.backend.services.service.IMainServiceService
import hu.bme.jj.appointmentapp.backend.services.user.UserService
import jakarta.persistence.EntityNotFoundException
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service

@Service
class ProviderService(
    private val repository: ProviderRepository,
    private val mainServiceService: IMainServiceService,
    private val userService: UserService,
    private val userRepository: UserRepository,
) : IProviderService {

    private fun getProviderByUserIdFromRepositoryOrThrow(id: Long): Provider {
        return getProviderByUserIdFromRepository(id) ?: throw EntityNotFoundException("Provider not found with id $id")
    }

    private fun getProviderByUserIdFromRepository(id: Long): Provider? {
        return repository.findByUserId(id).orElse(null)
    }

    private fun mapToDTOOptional(provider: Provider?): ProviderDTO? = if (provider != null) {
        mapToDTO(provider)
    } else {
        null
    }

    private fun mapToDTO(provider: Provider): ProviderDTO = ProviderDTO(
        provider.user.id,
        provider.user.name,
        provider.user.phoneNumber,
        provider.user.email,
        provider.user.sendDailyAppointmentNotification,
        provider.bio,
        provider.businessAddress,
        provider.sendDailyAppointmentReport
    )
    private fun mapToEntity(provider: ProviderDTO): Provider {
        val providerEntity = repository.findByUserId(provider.id!!).orElse(null)
        return Provider(
            providerEntity?.id,
            provider.bio ?: "",
            provider.businessAddress,
            provider.sendDailyAppointmentReport,
            providerEntity?.user ?: userRepository.findById(provider.id)
                .orElseThrow{ EntityNotFoundException("User not found with id #${provider.id}")}
        )
    }

    override fun getAllProviders(): List<ProviderDTO> {
        return repository.findAll().map { mapToDTO(it) }
    }

    override fun getProviderById(id: Long): ProviderDTO {
        return mapToDTO(getProviderByUserIdFromRepositoryOrThrow(id))
    }

    override fun getProvidersByForm(name: String?, globalServiceId: Long?, subServiceName: String?): List<ProviderDTO> {
        var providers = repository.findAll()
        if (!name.isNullOrEmpty()) {
            providers = providers.filter { it.user.name?.lowercase()?.contains(name.lowercase()) ?: false }
        }
        if (globalServiceId != null) {
            providers = providers.filter { provider ->
                val mainServices = mainServiceService.getServicesByProviderId(provider.user.id!!)
                val mainService = mainServices.find { ms -> ms.globalService.id == globalServiceId }
                if (subServiceName.isNullOrEmpty()) {
                    // If we found a main service of the provider with the global service id
                    mainService != null
                } else {
                    // If we found a main service of the provider with the global service id, and it has the specified sub service name
                    mainService?.subServices?.find { it.name.lowercase() == subServiceName.lowercase() } != null
                }

            }
        }
        return providers.map { mapToDTO(it) }
    }

    override fun tryGetProviderById(id: Long): ProviderDTO? {
        return mapToDTOOptional(getProviderByUserIdFromRepository(id))
    }

    override fun updateProvider(updatedProvider: ProviderDTO): ProviderDTO {
        if (updatedProvider.id == null || getProviderByUserIdFromRepository(updatedProvider.id) == null) {
            throw EntityNotFoundException("Provider not found with user id ${updatedProvider.id}")
        }
        userService.updateUser(updatedProvider)
        return mapToDTO(repository.save(mapToEntity(updatedProvider)))
    }

    @Transactional
    override fun createProvider(provider: ProviderDTO): ProviderDTO {
        userService.updateUser(provider)
        return mapToDTO(repository.save(mapToEntity(provider)))
    }

    override fun deleteProvider(id: Long) {
        mainServiceService.deleteServicesByProviderId(id)
        repository.deleteById(id)
    }
}