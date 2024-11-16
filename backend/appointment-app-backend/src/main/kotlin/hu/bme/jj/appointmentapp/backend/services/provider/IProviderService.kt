package hu.bme.jj.appointmentapp.backend.services.provider

import hu.bme.jj.appointmentapp.backend.api.model.ProviderDTO
import hu.bme.jj.appointmentapp.backend.api.model.SortByTactic

interface IProviderService {
    fun updateProvider(updatedProvider: ProviderDTO): ProviderDTO

    fun createProvider(provider: ProviderDTO): ProviderDTO

    fun getAllProviders(): List<ProviderDTO>

    fun getProviderById(id: Long): ProviderDTO

    fun getProvidersByForm(name: String?, globalServiceId: Long?, subServiceName: String?, sortByTactic: SortByTactic?): List<ProviderDTO>

    fun tryGetProviderById(id: Long): ProviderDTO?

    fun deleteProvider(id: Long)
}