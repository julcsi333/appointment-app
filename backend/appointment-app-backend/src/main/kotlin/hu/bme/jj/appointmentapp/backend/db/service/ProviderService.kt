package hu.bme.jj.appointmentapp.backend.db.service

import hu.bme.jj.appointmentapp.backend.db.model.Provider
import hu.bme.jj.appointmentapp.backend.db.repository.ProviderRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.stereotype.Service

@Service
class ProviderService(private val repository: ProviderRepository) {
    fun getAllProviders(): List<Provider> {
        return repository.findAll()
    }

    fun existsById(id: Long): Boolean {
        return repository.existsById(id)
    }
    fun getProviderById(id: Long): Provider {
        return repository.findById(id).orElseThrow { EntityNotFoundException("Provider not found with id $id") }
    }

    fun createProvider(provider: Provider): Provider {
        return repository.save(provider)
    }

    fun updateProvider(id: Long, updatedProvider: Provider): Provider {
        if (!repository.existsById(id)) {
            throw EntityNotFoundException("Provider not found with id $id")
        }
        updatedProvider.id = id
        return repository.save(updatedProvider)
    }

    fun deleteProvider(id: Long) {
        repository.deleteById(id)
    }
}