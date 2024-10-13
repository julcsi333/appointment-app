package hu.bme.jj.appointmentapp.backend.services.user

import hu.bme.jj.appointmentapp.backend.api.model.UserDTO

interface IUserService {
    // TODO: remove this
    fun getOrCreateUserForAuth0(auth0UserId: String): UserDTO

    fun updateUser(updatedUser: UserDTO): UserDTO

    fun createUser(user: UserDTO, auth0UserId: String): UserDTO

    fun getAllUsers(): List<UserDTO>

    fun getUserById(id: Long): UserDTO

    fun tryGetUserByAuth0Id(id: String): UserDTO?

    fun deleteUser(id: Long)
}