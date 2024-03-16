package hu.bme.jj.appointmentapp.backend.api

import hu.bme.jj.appointmentapp.backend.db.model.Provider
import hu.bme.jj.appointmentapp.backend.db.repository.ProviderRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/providers")
class ProviderController(private val repository: ProviderRepository) {

    @GetMapping
    fun getAllEntities(): List<Provider> {
        return repository.findAll()
    }

    @GetMapping("/{id}")
    fun getEntityById(@PathVariable id: Long): Provider {
        return repository.findById(id).orElseThrow { EntityNotFoundException("Entity not found with id $id") }
    }

    @PostMapping
    fun createEntity(@RequestBody entity: Provider): Provider {
        return repository.save(entity)
    }

    @PutMapping("/{id}")
    fun updateEntity(@PathVariable id: Long, @RequestBody updatedEntity: Provider): Provider {
        if (!repository.existsById(id)) {
            throw EntityNotFoundException("Entity not found with id $id")
        }
        updatedEntity.id = id
        return repository.save(updatedEntity)
    }

    @DeleteMapping("/{id}")
    fun deleteEntity(@PathVariable id: Long) {
        repository.deleteById(id)
    }
}