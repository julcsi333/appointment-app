package hu.bme.jj.appointmentapp.backend.model


data class EmailMessage (
    val recipient: String,
    val msgBody: String,
    val subject: String,
    val attachment: String? = null,
)