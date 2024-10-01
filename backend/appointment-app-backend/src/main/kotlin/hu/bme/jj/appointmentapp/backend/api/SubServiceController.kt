package hu.bme.jj.appointmentapp.backend.api

import hu.bme.jj.appointmentapp.backend.api.model.ServiceDTO
import hu.bme.jj.appointmentapp.backend.api.model.SubServiceDTO
import hu.bme.jj.appointmentapp.backend.service.ISubServiceService
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/subServices")
class SubServiceController(private val subServiceService: ISubServiceService) {
    @GetMapping("/{id}")
    fun getServiceById(@PathVariable id: Long): SubServiceDTO {
        return subServiceService.getServiceById(id)
    }

    @GetMapping("/mainService/{id}")
    fun getSubServicesByMainServiceId(@PathVariable id: Long): List<SubServiceDTO> {
        return subServiceService.getServicesByMainServiceId(id)
    }

    @PostMapping("/{id}")
    fun createSubService(@PathVariable mainServiceId: Long, @RequestBody service: SubServiceDTO): SubServiceDTO {
        return subServiceService.createService(service, mainServiceId)
    }

    @PutMapping("/{id}")
    fun updateSubService(@PathVariable id: Long, @RequestBody updatedService: SubServiceDTO): SubServiceDTO {
        return subServiceService.updateService(updatedService)
    }

    @DeleteMapping("/{id}")
    fun deleteSubService(@PathVariable id: Long) {
        subServiceService.deleteService(id)
    }

}