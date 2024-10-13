package hu.bme.jj.appointmentapp.backend.services.email

import hu.bme.jj.appointmentapp.backend.model.EmailMessage
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.stereotype.Service

@Service
class EmailService(
    private val emailSender: JavaMailSender
): IEmailService {

    @Value("\${spring.mail.username}")
    lateinit var sender: String
    var logger: Logger = LoggerFactory.getLogger(EmailService::class.java)
    override fun sendMail(emailMessage: EmailMessage) {
        try {
            val mail = SimpleMailMessage()
            mail.from = sender
            mail.setTo(emailMessage.recipient)
            mail.subject = emailMessage.subject
            mail.text = emailMessage.msgBody
            emailSender.send(mail)
            logger.debug("Email '${emailMessage.subject}' sent to recipient '${emailMessage.recipient}'")
        } catch (ex: Exception) {
            logger.error("Couldn't send mail '${emailMessage.subject}' to recipient '${emailMessage.recipient}'")
        }
    }
}