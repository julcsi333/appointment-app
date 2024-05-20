package hu.bme.jj.appointmentapp.backend.api.model

class Appointment(
    val date: java.sql.Date,
    val customerId: Long,
    val serviceId: Long
)