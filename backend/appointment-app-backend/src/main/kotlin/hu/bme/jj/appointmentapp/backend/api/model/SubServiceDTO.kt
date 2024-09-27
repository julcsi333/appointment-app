package hu.bme.jj.appointmentapp.backend.api.model

data class SubServiceDTO(
    val id: Long?,
    val name: String,
    val duration: Int,
    val price: Float,
)