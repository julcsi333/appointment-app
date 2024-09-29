package hu.bme.jj.appointmentapp.backend.api

import hu.bme.jj.appointmentapp.backend.api.model.ProviderDTO
import hu.bme.jj.appointmentapp.backend.db.sql.model.Provider
import hu.bme.jj.appointmentapp.backend.service.IProviderService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/providers")
class ProviderController(private val providerService: IProviderService) {

    @GetMapping
    fun getAllProviders(): ResponseEntity<List<ProviderDTO>> {
        return ResponseEntity(providerService.getAllProviders(), HttpStatus.OK)
    }

    @GetMapping("/{id}")
    fun getProviderById(@PathVariable id: Long): ResponseEntity<ProviderDTO> {
        val provider = providerService.tryGetProviderById(id)
        return if(provider == null) {
            ResponseEntity(null, HttpStatus.NOT_FOUND)
        } else {
            ResponseEntity(provider, HttpStatus.OK)
        }
    }

    @PostMapping
    fun createProvider(@RequestBody entity: ProviderDTO): ResponseEntity<ProviderDTO> {
        return ResponseEntity(providerService.createProvider(entity), HttpStatus.OK)
    }

    @PutMapping("/{id}")
    fun updateProvider(@PathVariable id: Long, @RequestBody updatedEntity: ProviderDTO): ResponseEntity<ProviderDTO> {
        return ResponseEntity(providerService.updateProvider(updatedEntity), HttpStatus.OK)
    }

    @DeleteMapping("/{id}")
    fun deleteProvider(@PathVariable id: Long): ResponseEntity<String> {
        providerService.deleteProvider(id)
        return ResponseEntity.ok("Provider #$id deleted.")
    }
}