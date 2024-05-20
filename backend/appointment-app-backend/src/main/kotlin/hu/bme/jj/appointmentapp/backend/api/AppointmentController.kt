package hu.bme.jj.appointmentapp.backend.api

import hu.bme.jj.appointmentapp.backend.api.model.Appointment
import hu.bme.jj.appointmentapp.backend.db.service.AppointmentService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/book")
class AppointmentController(private val appointmentService: AppointmentService) {

    @PostMapping("/{id}")
    fun bookAppointment(@PathVariable id: Long, @RequestBody appointment: Appointment): hu.bme.jj.appointmentapp.backend.db.model.Appointment {
        return appointmentService.bookAppointment(id, appointment)
    }
}