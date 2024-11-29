package hu.bme.jj.appointmentapp.backend.api

import hu.bme.jj.appointmentapp.backend.api.model.AppointmentDTO
import hu.bme.jj.appointmentapp.backend.api.model.NewAppointmentDTO
import hu.bme.jj.appointmentapp.backend.api.model.ServiceDTO
import hu.bme.jj.appointmentapp.backend.services.appointment.IAppointmentService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/appointments")
class AppointmentController(private val appointmentService: IAppointmentService) {

    @GetMapping("/customer/{id}")
    fun getAppointmentsById(@PathVariable id: Long): ResponseEntity<List<AppointmentDTO>> {
        return ResponseEntity.ok(
            appointmentService.getAppointmentsForCustomer(id)
        )
    }

    @GetMapping("/provider/{id}")
    fun getHostedAppointmentsById(@PathVariable id: Long): ResponseEntity<List<AppointmentDTO>> {
        return ResponseEntity.ok(
            appointmentService.getAppointmentsForProvider(id)
        )
    }

    @PostMapping("/book")
    fun createAppointment(@RequestBody appointment: NewAppointmentDTO): ResponseEntity<AppointmentDTO> {
        return ResponseEntity.ok(appointmentService.bookAppointment(appointment))
    }

    @PutMapping("/{id}")
    fun modifyAppointment(@PathVariable id: Long, @RequestBody appointment: AppointmentDTO): ResponseEntity<AppointmentDTO> {
        return ResponseEntity.ok(appointmentService.modifyAppointment(appointment))
    }

    @DeleteMapping("/{id}", params = ["customerCancelled"])
    fun deleteAppointment(@PathVariable id: Long,  @RequestParam customerCancelled: Boolean): ResponseEntity<String> {
        appointmentService.cancelAppointment(id, customerCancelled)
        return ResponseEntity.ok("Appointment #$id deleted successfully.")
    }
}