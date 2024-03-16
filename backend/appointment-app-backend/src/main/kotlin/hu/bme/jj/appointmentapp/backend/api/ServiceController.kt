package hu.bme.jj.appointmentapp.backend.api

import hu.bme.jj.appointmentapp.backend.db.model.Service
import hu.bme.jj.appointmentapp.backend.db.repository.ServiceRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/services")
class ServiceController(private val repository: ServiceRepository) {
    @GetMapping
    fun getAllEntities(): List<Service> {
        return repository.findAll()
    }

    @GetMapping("/{id}")
    fun getEntityById(@PathVariable id: Long): Service {
        return repository.findById(id).orElseThrow { EntityNotFoundException("Entity not found with id $id") }
    }

    @PostMapping
    fun createEntity(@RequestBody entity: Service): Service {
        return repository.save(entity)
    }

    @PutMapping("/{id}")
    fun updateEntity(@PathVariable id: Long, @RequestBody updatedEntity: Service): Service {
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