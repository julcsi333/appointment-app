package hu.bme.jj.appointmentapp.backend.services.email

import hu.bme.jj.appointmentapp.backend.model.EmailMessage

interface IEmailService {
    fun sendMail(emailMessage: EmailMessage)
}