package hu.bme.jj.appointmentapp.backend.api.model

open class UserDTO(
    val id: Long?,
    val name: String?,
    val phoneNumber: String?,
    val email: String?,
    val bio: String = ""
)