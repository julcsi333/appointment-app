package hu.bme.jj.appointmentapp.backend.api

import hu.bme.jj.appointmentapp.backend.db.sql.model.MainService
import hu.bme.jj.appointmentapp.backend.db.sql.repository.ServiceRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/services")
class ServiceController(private val repository: ServiceRepository) {
    @GetMapping
    fun getAllEntities(): List<MainService> {
        return repository.findAll()
    }

    @GetMapping("/{id}")
    fun getEntityById(@PathVariable id: Long): MainService {
        return repository.findById(id).orElseThrow { EntityNotFoundException("Entity not found with id $id") }
    }

    @PostMapping
    fun createEntity(@RequestBody entity: MainService): MainService {
        return repository.save(entity)
    }

    @PutMapping("/{id}")
    fun updateEntity(@PathVariable id: Long, @RequestBody updatedEntity: MainService): MainService {
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