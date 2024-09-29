package hu.bme.jj.appointmentapp.backend.api

import hu.bme.jj.appointmentapp.backend.api.model.ServiceDTO
import hu.bme.jj.appointmentapp.backend.db.sql.model.MainService
import hu.bme.jj.appointmentapp.backend.db.sql.repository.ServiceRepository
import hu.bme.jj.appointmentapp.backend.service.IMainServiceService
import jakarta.persistence.EntityNotFoundException
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/services")
class ServiceController(private val mainServiceService: IMainServiceService) {
    @GetMapping
    fun getAllServices(): List<ServiceDTO> {
        return mainServiceService.getAllMainServices()
    }

    @GetMapping("/{id}")
    fun getServiceById(@PathVariable id: Long): ServiceDTO {
        return mainServiceService.getServiceById(id)
    }

    @GetMapping("/provider/{id}")
    fun getServiceByProviderId(@PathVariable id: Long): List<ServiceDTO> {
        return mainServiceService.getServicesByProviderId(id)
    }

    @PostMapping
    fun createService(@RequestBody service: ServiceDTO): ServiceDTO {
        return mainServiceService.createService(service)
    }

    @PutMapping("/{id}")
    fun updateService(@PathVariable id: Long, @RequestBody updatedService: ServiceDTO): ServiceDTO {
        return mainServiceService.updateService(updatedService)
    }

    @DeleteMapping("/{id}")
    fun deleteService(@PathVariable id: Long) {
        mainServiceService.deleteService(id)
    }

}