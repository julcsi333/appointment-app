package hu.bme.jj.appointmentapp.backend.api

import hu.bme.jj.appointmentapp.backend.db.sql.model.Provider
import hu.bme.jj.appointmentapp.backend.service.ProviderService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/providers")
class ProviderController(private val providerService: ProviderService) {

    @GetMapping
    fun getAllProviders(): List<Provider> {
        return providerService.getAllProviders()
    }

    @GetMapping("/{id}")
    fun getProviderById(@PathVariable id: Long): Provider {
        return providerService.getProviderById(id)
    }

    @PostMapping
    fun createProvider(@RequestBody entity: Provider): Provider {
        return providerService.createProvider(entity)
    }

    @PutMapping("/{id}")
    fun updateProvider(@PathVariable id: Long, @RequestBody updatedEntity: Provider): Provider {
        return providerService.updateProvider(id, updatedEntity)
    }

    @DeleteMapping("/{id}")
    fun deleteProvider(@PathVariable id: Long) {
        providerService.deleteProvider(id)
    }
}