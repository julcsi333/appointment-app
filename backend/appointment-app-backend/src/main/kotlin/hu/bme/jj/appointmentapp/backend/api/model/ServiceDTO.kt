package hu.bme.jj.appointmentapp.backend.api.model


data class ServiceDTO(
    val id: Long?,
    val description: String,
    val subServices: List<SubServiceDTO> = listOf(),
    val globalService: GlobalServiceDTO,
    val providerId: Long,
)