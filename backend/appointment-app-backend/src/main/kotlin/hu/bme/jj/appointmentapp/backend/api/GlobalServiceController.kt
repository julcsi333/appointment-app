package hu.bme.jj.appointmentapp.backend.api

import hu.bme.jj.appointmentapp.backend.api.model.GlobalServiceDTO
import hu.bme.jj.appointmentapp.backend.services.service.IGlobalServiceService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/globalServices")
class GlobalServiceController(private val globalServiceService: IGlobalServiceService) {
    @GetMapping
    fun getAllGlobalServices(): List<GlobalServiceDTO> {
        return globalServiceService.getAllGlobalServices()
    }

    @GetMapping("/{id}")
    fun getGlobalServiceById(@PathVariable id: Long): GlobalServiceDTO {
        return globalServiceService.getGlobalServiceById(id)
    }

}