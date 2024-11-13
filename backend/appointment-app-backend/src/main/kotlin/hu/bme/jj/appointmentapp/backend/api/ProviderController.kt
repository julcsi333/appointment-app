package hu.bme.jj.appointmentapp.backend.api

import hu.bme.jj.appointmentapp.backend.api.model.BookableTimeDTO
import hu.bme.jj.appointmentapp.backend.api.model.ProviderAvailabilityDTO
import hu.bme.jj.appointmentapp.backend.api.model.ProviderAvailabilityRuleDTO
import hu.bme.jj.appointmentapp.backend.api.model.ProviderDTO
import hu.bme.jj.appointmentapp.backend.config.Configuration
import hu.bme.jj.appointmentapp.backend.services.provider.IProviderAvailabilityRuleService
import hu.bme.jj.appointmentapp.backend.services.provider.IProviderAvailabilityService
import hu.bme.jj.appointmentapp.backend.services.provider.IProviderService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/providers")
class ProviderController(
    private val providerService: IProviderService,
    private val providerAvailabilityService: IProviderAvailabilityService,
    private val providerAvailabilityRuleService: IProviderAvailabilityRuleService
) {

    @GetMapping
    fun getAllProvidersByForm(@RequestParam(required = false) name: String?, @RequestParam(required = false) globalServiceId: Long?, @RequestParam(required = false) subServiceName: String?): ResponseEntity<List<ProviderDTO>> {
        return ResponseEntity(providerService.getProvidersByForm(name, globalServiceId, subServiceName), HttpStatus.OK)
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
        if (updatedEntity.name.isNullOrEmpty()) {
            throw IllegalArgumentException("Name '${updatedEntity.name}' is not valid.")
        }
        if (updatedEntity.email.isNullOrEmpty() || Configuration.emailRegex.matches(updatedEntity.email)) {
            throw IllegalArgumentException("E-mail address '${updatedEntity.email}' is not valid.")
        }
        if (updatedEntity.phoneNumber.isNullOrEmpty() || Configuration.phoneRegex.matches(updatedEntity.email)) {
            throw IllegalArgumentException("Phone number '${updatedEntity.phoneNumber}' is not valid.")
        }
        return ResponseEntity(providerService.updateProvider(updatedEntity), HttpStatus.OK)
    }

    @DeleteMapping("/{id}")
    fun deleteProvider(@PathVariable id: Long): ResponseEntity<String> {
        providerService.deleteProvider(id)
        return ResponseEntity.ok("Provider #$id deleted.")
    }

    @GetMapping("/{providerId}/availability")
    fun getProviderAvailabilities(@PathVariable providerId: Long): ResponseEntity<List<ProviderAvailabilityDTO>> {
        return ResponseEntity(providerAvailabilityService.getPAsByProviderId(providerId), HttpStatus.OK)
    }

    @GetMapping("/{providerId}/availability/bookable", params = ["bookTime"])
    fun getProviderBookableAvailability(@PathVariable providerId: Long, @RequestParam bookTime: Long): ResponseEntity<List<BookableTimeDTO>> {
        return ResponseEntity(providerAvailabilityService.getBookablePAsByProviderId(providerId, bookTime), HttpStatus.OK)
    }

    @PostMapping("/{providerId}/availability")
    fun createProviderAvailability(@PathVariable providerId: Long, @RequestBody entity: ProviderAvailabilityDTO): ResponseEntity<ProviderAvailabilityDTO> {
        return ResponseEntity(providerAvailabilityService.createPA(entity), HttpStatus.OK)
    }

    @PutMapping("/{providerId}/availability/{id}")
    fun updateProviderAvailability(@PathVariable providerId: Long, @PathVariable id: Long, @RequestBody updatedEntity: ProviderAvailabilityDTO): ResponseEntity<ProviderAvailabilityDTO> {
        return ResponseEntity(providerAvailabilityService.updatePA(updatedEntity), HttpStatus.OK)
    }

    @DeleteMapping("/{providerId}/availability/{id}")
    fun deleteProviderAvailability(@PathVariable providerId: Long, @PathVariable id: Long): ResponseEntity<String> {
        providerAvailabilityService.deletePA(id)
        return ResponseEntity.ok("Provider availability #$id deleted.")
    }

    @GetMapping("/{providerId}/availability/rule")
    fun getProviderAvailabilityRules(@PathVariable providerId: Long): ResponseEntity<List<ProviderAvailabilityRuleDTO>> {
        return ResponseEntity(providerAvailabilityRuleService.getPARulesByProviderId(providerId), HttpStatus.OK)
    }
    @PostMapping("/{providerId}/availability/rule")
    fun createProviderAvailabilityRule(@PathVariable providerId: Long, @RequestBody entity: ProviderAvailabilityRuleDTO): ResponseEntity<ProviderAvailabilityRuleDTO> {
        return ResponseEntity(providerAvailabilityRuleService.createPARule(entity), HttpStatus.OK)
    }

    @PutMapping("/{providerId}/availability/rule/{id}")
    fun updateProviderAvailabilityRule(@PathVariable providerId: Long, @PathVariable id: Long, @RequestBody updatedEntity: ProviderAvailabilityRuleDTO): ResponseEntity<ProviderAvailabilityRuleDTO> {
        return ResponseEntity(providerAvailabilityRuleService.updatePARule(updatedEntity), HttpStatus.OK)
    }

    @DeleteMapping("/{providerId}/availability/rule/{id}")
    fun deleteProviderAvailabilityRule(@PathVariable providerId: Long, @PathVariable id: Long): ResponseEntity<String> {
        providerAvailabilityRuleService.deletePARule(id)
        return ResponseEntity.ok("Provider availability rule #$id deleted.")
    }
}