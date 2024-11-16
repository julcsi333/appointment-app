package hu.bme.jj.appointmentapp.backend.services.provider

import hu.bme.jj.appointmentapp.backend.api.model.ProviderDTO
import hu.bme.jj.appointmentapp.backend.api.model.SortByTactic
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
    private fun saveProvider(provider: ProviderDTO): Provider {
        val providerEntity = repository.findByUserId(provider.id!!).orElse(null)
        return repository.save( if (providerEntity != null) {
            // Updated provider
            Provider(
                providerEntity.id,
                provider.bio ?: "",
                provider.businessAddress,
                provider.sendDailyAppointmentReport,
                providerEntity.user,
                providerEntity.appointments,
                providerEntity.mainServices
            )
        } else {
            // New provider
            Provider(
                null,
                provider.bio ?: "",
                provider.businessAddress,
                provider.sendDailyAppointmentReport,
                userRepository.findById(provider.id)
                    .orElseThrow{ EntityNotFoundException("User not found with id #${provider.id}")}
            )
        })
    }

    override fun getAllProviders(): List<ProviderDTO> {
        return repository.findAll().map { mapToDTO(it) }
    }

    override fun getProviderById(id: Long): ProviderDTO {
        return mapToDTO(getProviderByUserIdFromRepositoryOrThrow(id))
    }

    override fun getProvidersByForm(name: String?, globalServiceId: Long?, subServiceName: String?, sortByTactic: SortByTactic?): List<ProviderDTO> {
        val providers = if (name.isNullOrEmpty()) {
            if (globalServiceId != null) {
                if (subServiceName.isNullOrEmpty()) {
                    when(sortByTactic) {
                        SortByTactic.POPULARITY -> repository.findAllByFormOrderedByPopularity("", globalServiceId)
                        SortByTactic.PRICE_AVG -> repository.findAllByFormOrderedByAveragePrice("", globalServiceId)
                        SortByTactic.PRICE_LOWEST -> repository.findAllByFormOrderedByLowestPrice("", globalServiceId)
                        null -> repository.findAllByFormOrderedByPopularity("", globalServiceId)
                    }
                } else {
                    when(sortByTactic) {
                        SortByTactic.POPULARITY -> repository.findAllByFormOrderedByPopularity("", globalServiceId, subServiceName)
                        SortByTactic.PRICE_AVG -> repository.findAllByFormOrderedByAveragePrice("", globalServiceId, subServiceName)
                        SortByTactic.PRICE_LOWEST -> repository.findAllByFormOrderedByLowestPrice("", globalServiceId, subServiceName)
                        null -> repository.findAllByFormOrderedByPopularity("", globalServiceId, subServiceName)
                    }
                }
            } else {
                when(sortByTactic) {
                    SortByTactic.POPULARITY -> repository.findAllByFormOrderedByPopularity()
                    SortByTactic.PRICE_AVG -> repository.findAllByFormOrderedByAveragePrice()
                    SortByTactic.PRICE_LOWEST -> repository.findAllByFormOrderedByLowestPrice()
                    null -> repository.findAllByFormOrderedByPopularity()
                }
            }
        } else {
            if (globalServiceId != null) {
                if (subServiceName.isNullOrEmpty()) {
                    when(sortByTactic) {
                        SortByTactic.POPULARITY -> repository.findAllByFormOrderedByPopularity(name, globalServiceId)
                        SortByTactic.PRICE_AVG -> repository.findAllByFormOrderedByAveragePrice(name, globalServiceId)
                        SortByTactic.PRICE_LOWEST -> repository.findAllByFormOrderedByLowestPrice(name, globalServiceId)
                        null -> repository.findAllByFormOrderedByPopularity(name, globalServiceId)
                    }
                } else {
                    when(sortByTactic) {
                        SortByTactic.POPULARITY -> repository.findAllByFormOrderedByPopularity(name, globalServiceId, subServiceName)
                        SortByTactic.PRICE_AVG -> repository.findAllByFormOrderedByAveragePrice(name, globalServiceId, subServiceName)
                        SortByTactic.PRICE_LOWEST -> repository.findAllByFormOrderedByLowestPrice(name, globalServiceId, subServiceName)
                        null -> repository.findAllByFormOrderedByPopularity(name, globalServiceId, subServiceName)
                    }
                }
            } else {
                when(sortByTactic) {
                    SortByTactic.POPULARITY -> repository.findAllByFormOrderedByPopularity(name)
                    SortByTactic.PRICE_AVG -> repository.findAllByFormOrderedByAveragePrice(name)
                    SortByTactic.PRICE_LOWEST -> repository.findAllByFormOrderedByLowestPrice(name)
                    null -> repository.findAllByFormOrderedByPopularity(name)
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
        return mapToDTO(saveProvider(updatedProvider))
    }

    @Transactional
    override fun createProvider(provider: ProviderDTO): ProviderDTO {
        userService.updateUser(provider)
        return mapToDTO(saveProvider(provider))
    }

    override fun deleteProvider(id: Long) {
        mainServiceService.deleteServicesByProviderId(id)
        repository.deleteById(id)
    }
}