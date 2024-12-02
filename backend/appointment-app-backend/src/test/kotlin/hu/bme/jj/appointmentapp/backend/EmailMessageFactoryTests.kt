package hu.bme.jj.appointmentapp.backend

import hu.bme.jj.appointmentapp.backend.services.email.EmailMessageFactory
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean

@SpringBootTest
class EmailMessageFactoryTests {
    @MockBean
    private lateinit var emailMessageFactory: EmailMessageFactory
    @Test
    fun `should send cancel e-mail to provider when appointment is canceled by customer`() {
        // Arrange
        val customerCancelled = true

        // Act
        val emailMessage = emailMessageFactory.createAppointmentCancelledEmail(mockAppointment, customerCancelled)

        // Assert
        assert(emailMessage.recipient == mockProvider.user.email)
    }
}