package hu.bme.jj.appointmentapp.backend.api.model

open class UserDTO(
    val id: String,
    val name: String?,
    val phoneNumber: String?,
    val email: String?,
    val profileImageUrl: String?,
    val bio: String = ""
)