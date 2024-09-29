package hu.bme.jj.appointmentapp.backend.service

import hu.bme.jj.appointmentapp.backend.api.model.AppointmentDTO

interface IAppointmentService {
    fun bookAppointment(appointment: AppointmentDTO): AppointmentDTO
}