package hu.bme.jj.appointmentapp.backend.service

import hu.bme.jj.appointmentapp.backend.api.model.ProviderDTO
import hu.bme.jj.appointmentapp.backend.api.model.UserDTO

interface IUserService {
    fun updateUser(updatedUser: UserDTO): UserDTO

    fun createUser(user: UserDTO): UserDTO

    fun getAllUsers(): List<UserDTO>

    fun getProviderById(id: Long): UserDTO

    fun tryGetUserByAuth0Id(id: Long): UserDTO?

    fun deleteUser(id: Long)
}