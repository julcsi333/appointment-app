package hu.bme.jj.appointmentapp.backend

import hu.bme.jj.appointmentapp.backend.db.sql.model.Appointment
import hu.bme.jj.appointmentapp.backend.db.sql.model.GlobalService
import hu.bme.jj.appointmentapp.backend.db.sql.model.MainService
import hu.bme.jj.appointmentapp.backend.db.sql.model.Provider
import hu.bme.jj.appointmentapp.backend.db.sql.model.SubService
import hu.bme.jj.appointmentapp.backend.db.sql.model.UserData
import java.sql.Date
import java.sql.Time
import java.time.LocalDate
import java.time.LocalTime

val mockUser: UserData = UserData(2L, "Jane Doe", "1234", "janeDoe@gmail.com")

val mockProvider: Provider = Provider(
    3L,
    "",
    "address",
    true,
    UserData(4L, "John Doe", "5678", "johnDoe@gmail.com")
)

val mockSubService: SubService = SubService(
    null,
    "haircut",
    30,
    25.5f,
    MainService(null, "", mockProvider, GlobalService(null, "Hairdressing", ""))
)

val mockAppointment: Appointment = Appointment(id = 1L, date = Date.valueOf(LocalDate.now()),
    startTime = Time.valueOf(LocalTime.now()),
    endTime = Time.valueOf(LocalTime.now()),
    customer = mockUser,
    provider = mockProvider,
    subService = mockSubService
)