package hu.bme.jj.appointmentapp.backend.db.sql.repository

import hu.bme.jj.appointmentapp.backend.db.sql.model.UserData
import org.springframework.data.jpa.repository.JpaRepository

interface UserRepository : JpaRepository<UserData, Long>