package hu.bme.jj.appointmentapp.backend.api.model

class ProviderDTO(
    id: Long?,
    name: String?,
    phoneNumber: String?,
    email: String?,
    bio: String = "",
    sendDailyAppointmentNotification: Boolean = true,
    val businessAddress: String = "",
    val sendDailyAppointmentReport: Boolean = true,
) : UserDTO(id, name, phoneNumber, email, bio, sendDailyAppointmentNotification)