package hu.bme.jj.appointmentapp.backend.api.model

class ProviderDTO(
    id: Long?,
    name: String?,
    phoneNumber: String?,
    email: String?,
    bio: String = "",
    val businessAddress: String = "",
    val services: List<ServiceDTO> = listOf()
) : UserDTO(id, name, phoneNumber, email, bio)