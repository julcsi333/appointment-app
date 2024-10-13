package hu.bme.jj.appointmentapp.backend.service

import hu.bme.jj.appointmentapp.backend.api.model.BookableTimeDTO
import hu.bme.jj.appointmentapp.backend.api.model.ProviderAvailabilityDTO

interface IProviderAvailabilityService {

    fun updatePA(updatedPA: ProviderAvailabilityDTO): ProviderAvailabilityDTO

    fun createPA(providerAvailability: ProviderAvailabilityDTO): ProviderAvailabilityDTO

    fun getAllPAs(): List<ProviderAvailabilityDTO>

    fun getPAById(id: Long): ProviderAvailabilityDTO

    fun getPAsByProviderId(id: Long): List<ProviderAvailabilityDTO>

    fun getBookablePAsByProviderId(id: Long, bookTimeMinutes: Long): List<BookableTimeDTO>

    fun deletePA(id: Long)
}