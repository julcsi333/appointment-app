package hu.bme.jj.appointmentapp.backend.api

import hu.bme.jj.appointmentapp.backend.api.model.AppointmentDTO
import hu.bme.jj.appointmentapp.backend.services.appointment.IAppointmentService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/book")
class AppointmentController(private val appointmentService: IAppointmentService) {

    @PostMapping("/{id}")
    fun bookAppointment(@PathVariable id: Long, @RequestBody appointment: AppointmentDTO): AppointmentDTO {
        appointment.providerId = id
        return appointmentService.bookAppointment(appointment)
    }
}