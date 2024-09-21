package hu.bme.jj.appointmentapp.backend.api

import hu.bme.jj.appointmentapp.backend.api.model.AppointmentDTO
import hu.bme.jj.appointmentapp.backend.db.sql.model.Appointment
import hu.bme.jj.appointmentapp.backend.service.AppointmentService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/book")
class AppointmentController(private val appointmentService: AppointmentService) {

    @PostMapping("/{id}")
    fun bookAppointment(@PathVariable id: Long, @RequestBody appointment: AppointmentDTO): Appointment {
        return appointmentService.bookAppointment(id, appointment)
    }
}