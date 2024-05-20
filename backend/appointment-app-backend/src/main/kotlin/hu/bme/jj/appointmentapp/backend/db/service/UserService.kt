package hu.bme.jj.appointmentapp.backend.db.service

import hu.bme.jj.appointmentapp.backend.db.model.Auth0UserMapping
import hu.bme.jj.appointmentapp.backend.db.model.UserData
import hu.bme.jj.appointmentapp.backend.db.repository.Auth0UserMappingRepository
import hu.bme.jj.appointmentapp.backend.db.repository.UserRepository
import jakarta.persistence.EntityNotFoundException
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service

@Service
class UserService (
    private val userRepository: UserRepository,
    private val auth0UserMappingRepository: Auth0UserMappingRepository,
    private val providerService: ProviderService
) {

    fun findAllUsers(): List<UserData> = userRepository.findAll()
    fun saveUser(user: UserData): UserData = userRepository.save(user)

    @Transactional
    fun getOrCreateUserForAuth0(auth0UserId: String): UserData {
        val mapping = auth0UserMappingRepository.findByAuth0UserId(auth0UserId)
        return if (mapping != null) {
            mapping.localUser
        } else {
            val newUser = userRepository.save(UserData(null,null,null))
            val newMapping = Auth0UserMapping(auth0UserId = auth0UserId, localUser = newUser)
            auth0UserMappingRepository.save(newMapping)
            newUser
        }
    }

    fun getUserById(id: Long): UserData {
        return userRepository.findById(id).orElseThrow { EntityNotFoundException("User not found with id $id") }
    }

    fun updateUser(id: Long, updatedUser: UserData): UserData {
        if (!userRepository.existsById(id)) {
            throw EntityNotFoundException("Provider not found with id $id")
        }
        updatedUser.id = id
        return userRepository.save(updatedUser)
    }

    fun deleteUser(id: Long) {
        if (providerService.existsById(id)) {
            providerService.deleteProvider(id)
        } else {
            userRepository.deleteById(id)
        }
    }
}