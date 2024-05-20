package hu.bme.jj.appointmentapp.backend.db.repository

import hu.bme.jj.appointmentapp.backend.db.model.UserData
import org.springframework.data.jpa.repository.JpaRepository

interface UserRepository : JpaRepository<UserData, Long>