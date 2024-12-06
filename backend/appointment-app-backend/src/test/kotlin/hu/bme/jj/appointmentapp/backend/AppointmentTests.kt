package hu.bme.jj.appointmentapp.backend

import hu.bme.jj.appointmentapp.backend.db.sql.repository.AppointmentRepository
import hu.bme.jj.appointmentapp.backend.db.sql.repository.ProviderRepository
import hu.bme.jj.appointmentapp.backend.db.sql.repository.SubServiceRepository
import hu.bme.jj.appointmentapp.backend.db.sql.repository.UserRepository
import hu.bme.jj.appointmentapp.backend.model.EmailMessage
import hu.bme.jj.appointmentapp.backend.services.appointment.AppointmentService
import hu.bme.jj.appointmentapp.backend.services.email.EmailMessageFactory
import hu.bme.jj.appointmentapp.backend.services.email.EmailService
import hu.bme.jj.appointmentapp.backend.services.email.IEmailMessageFactory
import hu.bme.jj.appointmentapp.backend.services.email.IEmailService
import jakarta.persistence.EntityNotFoundException
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test
import org.mockito.kotlin.any
import org.mockito.kotlin.never
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import java.util.*

@SpringBootTest
class AppointmentTests {

	@Test
	fun contextLoads() {
	}

	@MockBean
	private lateinit var mockAppointmentRepository: AppointmentRepository

	@MockBean
	private lateinit var mockEmailService: IEmailService

	@MockBean
	private lateinit var mockEmailMessageFactory: IEmailMessageFactory

	@Autowired
	private lateinit var appointmentService: AppointmentService

	@MockBean
	private lateinit var providerRepository: ProviderRepository
	@MockBean
	private lateinit var userRepository: UserRepository
	@MockBean
	private lateinit var subServiceRepository: SubServiceRepository

	@Test
	fun `should call emailService with correct parameters when appointment is canceled`() {
		// Arrange
		val appointmentId = 1L
		val customerCancelled = true

		whenever(mockAppointmentRepository.findById(appointmentId)).thenReturn(Optional.of(mockAppointment))
		val emailMessage = EmailMessage(
			recipient = mockProvider.user.email!!,
			msgBody = "",
			subject = ""
		)
		whenever(mockEmailMessageFactory.createAppointmentCancelledEmail(mockAppointment, customerCancelled)).thenReturn(emailMessage)

		// Act
		appointmentService.cancelAppointment(appointmentId, customerCancelled)

		// Assert
		verify(mockEmailService).sendMail(emailMessage)
	}

	@Test
	fun `should throw EntityNotFoundException when appointment is not found`() {
		val appointmentId = 1L
		whenever(mockAppointmentRepository.findById(appointmentId)).thenReturn(Optional.empty())

		assertThrows(EntityNotFoundException::class.java) {
			appointmentService.cancelAppointment(appointmentId, true)
		}
		verify(mockEmailService, never()).sendMail(any())
	}

}
