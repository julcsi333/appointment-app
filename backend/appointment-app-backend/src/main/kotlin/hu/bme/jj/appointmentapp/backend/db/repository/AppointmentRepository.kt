package hu.bme.jj.appointmentapp.backend.db.repository

import hu.bme.jj.appointmentapp.backend.db.model.Appointment
import hu.bme.jj.appointmentapp.backend.db.model.Provider
import org.springframework.data.jpa.repository.JpaRepository

interface AppointmentRepository : JpaRepository<Appointment, Long>