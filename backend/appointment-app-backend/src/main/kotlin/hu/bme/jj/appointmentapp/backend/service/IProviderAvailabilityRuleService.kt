package hu.bme.jj.appointmentapp.backend.service

import hu.bme.jj.appointmentapp.backend.api.model.ProviderAvailabilityRuleDTO

interface IProviderAvailabilityRuleService {

    fun updatePARule(updatedPARule: ProviderAvailabilityRuleDTO): ProviderAvailabilityRuleDTO

    fun createPARule(paRule: ProviderAvailabilityRuleDTO): ProviderAvailabilityRuleDTO

    fun getAllPARules(): List<ProviderAvailabilityRuleDTO>

    fun getPARuleById(id: Long): ProviderAvailabilityRuleDTO

    fun getPARulesByProviderId(id: Long): List<ProviderAvailabilityRuleDTO>

    fun deletePARule(id: Long)
}