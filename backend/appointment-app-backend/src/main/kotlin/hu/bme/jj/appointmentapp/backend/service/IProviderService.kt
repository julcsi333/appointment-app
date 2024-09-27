package hu.bme.jj.appointmentapp.backend.service

import hu.bme.jj.appointmentapp.backend.api.model.ProviderDTO
import hu.bme.jj.appointmentapp.backend.api.model.ServiceDTO

interface IProviderService {
    fun updateProvider(updatedProvider: ProviderDTO): ProviderDTO

    fun createProvider(provider: ProviderDTO): ProviderDTO

    fun getAllProviders(): List<ProviderDTO>

    fun getProviderById(id: Long): ProviderDTO

    fun tryGetProviderById(id: Long): ProviderDTO?

    fun deleteProvider(id: Long)
}