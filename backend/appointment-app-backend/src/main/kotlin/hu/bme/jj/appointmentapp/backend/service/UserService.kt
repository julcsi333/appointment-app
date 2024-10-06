package hu.bme.jj.appointmentapp.backend.service

import hu.bme.jj.appointmentapp.backend.api.model.UserDTO
import hu.bme.jj.appointmentapp.backend.db.sql.model.Auth0UserMapping
import hu.bme.jj.appointmentapp.backend.db.sql.model.UserData
import hu.bme.jj.appointmentapp.backend.db.sql.repository.Auth0UserMappingRepository
import hu.bme.jj.appointmentapp.backend.db.sql.repository.ProviderRepository
import hu.bme.jj.appointmentapp.backend.db.sql.repository.UserRepository
import jakarta.persistence.EntityExistsException
import jakarta.persistence.EntityNotFoundException
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service

@Service
class UserService (
    private val repository: UserRepository,
    private val auth0UserMappingRepository: Auth0UserMappingRepository,
    private val providerRepository: ProviderRepository
): IUserService {

    @Transactional
    override fun getOrCreateUserForAuth0(auth0UserId: String): UserDTO {
        val mapping = auth0UserMappingRepository.findByAuth0UserId(auth0UserId)
        return if (mapping != null) {
            mapToDTO(mapping.localUser)
        } else {
            val newUser = repository.save(UserData(null,null,null))
            val newMapping = Auth0UserMapping(auth0UserId = auth0UserId, localUser = newUser)
            auth0UserMappingRepository.save(newMapping)
            mapToDTO(newUser)
        }
    }

    private fun getUserByIdFromRepositoryOrThrow(id: Long): UserData {
        return getUserByIdFromRepository(id) ?: throw EntityNotFoundException("User not found with id $id")
    }

    private fun getUserByIdFromRepository(id: Long): UserData? {
        return repository.findById(id).orElse(null)
    }

    fun mapToDTO(user: UserData): UserDTO {
        return UserDTO(
            user.id,
            user.name,
            user.phoneNumber,
            user.email,
            user.bio ?: ""
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

    override fun updateUser(updatedUser: UserDTO): UserDTO {
        if (updatedUser.id == null || !repository.existsById(updatedUser.id)) {
            throw NullPointerException("User id null when updating")
        }
        return mapToDTO(
            repository.save(
                mapToEntity(updatedUser)
            )
        )
    }

    @Transactional
    override fun createUser(user: UserDTO, auth0UserId: String): UserDTO {
        val mapping = auth0UserMappingRepository.findByAuth0UserId(auth0UserId)
        return if (mapping != null) {
            throw EntityExistsException("Can't create user: User #${user.id} with auth0 id $auth0UserId already exists.")
        } else {
            val newUser = repository.save(
                UserData(
                    null,
                    user.name,
                    user.phoneNumber,
                    user.email,
                    user.bio
                    )
            )
            val newMapping = Auth0UserMapping(auth0UserId = auth0UserId, localUser = newUser)
            auth0UserMappingRepository.save(newMapping)
            mapToDTO(newUser)
        }
    }

    override fun getAllUsers(): List<UserDTO> {
        return repository.findAll().map { mapToDTO(it) }
    }

    override fun getUserById(id: Long): UserDTO {
        return mapToDTO(getUserByIdFromRepositoryOrThrow(id))
    }

    override fun tryGetUserByAuth0Id(id: String): UserDTO? {
        val mapping = auth0UserMappingRepository.findByAuth0UserId(id)
        return if(mapping != null) {
            mapToDTO(
                getUserByIdFromRepositoryOrThrow(
                    mapping.localUser.id ?: throw NullPointerException("User id from auth0 id mapping (#$id) is null")
                )
            )
        } else {
            null
        }
    }

    override fun deleteUser(id: Long) {
        if (providerRepository.existsById(id)) {
            providerRepository.deleteById(id)
        }
        repository.deleteById(id)
    }
}