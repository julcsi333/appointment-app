package hu.bme.jj.appointmentapp.backend

import hu.bme.jj.appointmentapp.backend.db.sql.model.Appointment
import hu.bme.jj.appointmentapp.backend.db.sql.model.GlobalService
import hu.bme.jj.appointmentapp.backend.db.sql.model.MainService
import hu.bme.jj.appointmentapp.backend.db.sql.model.Provider
import hu.bme.jj.appointmentapp.backend.db.sql.model.SubService
import hu.bme.jj.appointmentapp.backend.db.sql.model.UserData
import hu.bme.jj.appointmentapp.backend.db.sql.repository.AppointmentRepository
import hu.bme.jj.appointmentapp.backend.model.EmailMessage
import hu.bme.jj.appointmentapp.backend.services.appointment.AppointmentService
import hu.bme.jj.appointmentapp.backend.services.email.EmailMessageFactory
import hu.bme.jj.appointmentapp.backend.services.email.EmailService
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
import java.sql.Date
import java.time.LocalDate
import java.time.LocalTime
import java.util.*

@SpringBootTest
class AppointmentDTOAppBackendApplicationTests {
/*
	@Test
	fun contextLoads() {
	}

	@MockBean
	private lateinit var appointmentRepository: AppointmentRepository

	@MockBean
	private lateinit var emailService: EmailService

	@MockBean
	private lateinit var emailMessageFactory: EmailMessageFactory

	@Autowired
	private lateinit var appointmentService: AppointmentService

	private val mockUser: UserData = UserData(2L, "Jane Doe", "1234", "janeDoe@gmail.com")

	private val mockProvider: Provider = Provider(
		3L,
		"",
		"address",
		true,
		UserData(4L, "John Doe", "5678", "johnDoe@gmail.com")
	)

	private val mockSubService: SubService = SubService(
		null,
		"haircut",
		30,
		25.5f,
		MainService(null, "", mockProvider, GlobalService(null, "Hairdressing", "")))

	private val mockAppointment: Appointment = Appointment(id = 1L, date = java.sql.Date.valueOf(LocalDate.now()),
		startTime = java.sql.Time.valueOf(LocalTime.now()),
		endTime = java.sql.Time.valueOf(LocalTime.now()),
		customer = mockUser,
		provider = mockProvider,
		subService = mockSubService
	)

	@Test
	fun `should call emailService with correct parameters when appointment is canceled`() {
		// Arrange
		val appointmentId = 1L
		val customerCancelled = true

		whenever(appointmentRepository.findById(appointmentId)).thenReturn(Optional.of(mockAppointment))
		val emailMessage = EmailMessage(
			recipient = mockProvider.user.email!!,
			msgBody = "",
			subject = ""
		)
		whenever(emailMessageFactory.createAppointmentCancelledEmail(mockAppointment, customerCancelled)).thenReturn(emailMessage)

		// Act
		appointmentService.cancelAppointment(appointmentId, customerCancelled)

		// Assert
		verify(emailService).sendMail(emailMessage)
		verify(appointmentRepository).findById(appointmentId)
	}

	@Test
	fun `should throw EntityNotFoundException when appointment is not found`() {
		val appointmentId = 1L
		whenever(appointmentRepository.findById(appointmentId)).thenReturn(Optional.empty())

		assertThrows(EntityNotFoundException::class.java) {
			appointmentService.cancelAppointment(appointmentId, true)
		}
		verify(emailService, never()).sendMail(any())
	}*/

}
