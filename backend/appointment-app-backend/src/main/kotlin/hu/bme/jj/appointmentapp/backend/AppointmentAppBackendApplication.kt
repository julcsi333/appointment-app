package hu.bme.jj.appointmentapp.backend

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class AppointmentAppBackendApplication

fun main(args: Array<String>) {
	runApplication<AppointmentAppBackendApplication>(*args)
}
