package hu.bme.jj.appointmentapp.backend.api.model

class ProviderDTO(
    id: String,
    name: String?,
    phoneNumber: String?,
    email: String?,
    profileImageUrl: String?,
    bio: String = "",
    val businessAddress: String = "",
    val services: List<ServiceDTO> = listOf()
) : UserDTO(id, name, phoneNumber, email, profileImageUrl, bio)