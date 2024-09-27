package hu.bme.jj.appointmentapp.backend.service

import hu.bme.jj.appointmentapp.backend.api.model.ServiceDTO
import hu.bme.jj.appointmentapp.backend.api.model.UserDTO
import hu.bme.jj.appointmentapp.backend.db.mongo.ImageService
import hu.bme.jj.appointmentapp.backend.db.sql.model.Auth0UserMapping
import hu.bme.jj.appointmentapp.backend.db.sql.model.MainService
import hu.bme.jj.appointmentapp.backend.db.sql.model.UserData
import hu.bme.jj.appointmentapp.backend.db.sql.repository.Auth0UserMappingRepository
import hu.bme.jj.appointmentapp.backend.db.sql.repository.ProviderRepository
import hu.bme.jj.appointmentapp.backend.db.sql.repository.UserRepository
import jakarta.persistence.EntityNotFoundException
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service

@Service
class UserService (
    private val repository: UserRepository,
    private val auth0UserMappingRepository: Auth0UserMappingRepository,
    private val providerRepository: ProviderRepository,
    private val imageService: ImageService
): IUserService {

    @Transactional
    fun getOrCreateUserForAuth0(auth0UserId: String): UserData {
        val mapping = auth0UserMappingRepository.findByAuth0UserId(auth0UserId)
        return if (mapping != null) {
            mapping.localUser
        } else {
            val newUser = repository.save(UserData(null,null,null))
            val newMapping = Auth0UserMapping(auth0UserId = auth0UserId, localUser = newUser)
            auth0UserMappingRepository.save(newMapping)
            newUser
        }
    }

    fun mapToDTO(user: UserData): UserDTO {
        return UserDTO(
            user.id,
            user.name,
            user.phoneNumber,
            user.email,
            user.bio
        )
    }

    fun mapToEntity(user: UserDTO): UserData {
        return UserData(
            user.id,
            user.name,
            user.phoneNumber,
            user.email,
            user.bio
        )
    }
    fun getUserById(id: Long): UserData {
        return repository.findById(id).orElseThrow { EntityNotFoundException("User not found with id $id") }
    }

    fun updateUser(id: Long, updatedUser: UserData): UserData {
        if (!repository.existsById(id)) {
            throw EntityNotFoundException("User not found with id $id")
        }
        updatedUser.id = id
        return repository.save(updatedUser)
    }

    override fun updateUser(updatedUser: UserDTO): UserDTO {
        if (updatedUser.id == null || repository.existsById(updatedUser.id)) {
            throw NullPointerException("Sub service id null when updating")
        }
        return mapToDTO(
            repository.save(
                mapToEntity(updatedUser)
            )
        )
    }

    override fun createUser(user: UserDTO): UserDTO {
        TODO("Not yet implemented")
    }

    override fun getAllUsers(): List<UserDTO> {
        TODO("Not yet implemented")
    }

    override fun getProviderById(id: Long): UserDTO {
        TODO("Not yet implemented")
    }

    override fun tryGetUserByAuth0Id(id: Long): UserDTO? {
        TODO("Not yet implemented")
    }

    override fun deleteUser(id: Long) {
        if (providerRepository.existsById(id)) {
            providerRepository.deleteById(id)
        }
        repository.deleteById(id)
    }
}