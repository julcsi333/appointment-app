package hu.bme.jj.appointmentapp.backend.api.model

class AppointmentDTO(
    val date: java.sql.Date,
    val customerId: Long,
    val serviceId: Long
)