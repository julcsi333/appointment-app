package hu.bme.jj.appointmentapp.backend.api.model

class AppointmentDTO(
    val id: Long?,
    val date: java.sql.Date,
    val customerId: Long,
    var providerId: Long,
    val subServiceId: Long
)