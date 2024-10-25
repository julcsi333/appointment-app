package hu.bme.jj.appointmentapp.backend.api

import hu.bme.jj.appointmentapp.backend.api.model.UserDTO
import hu.bme.jj.appointmentapp.backend.api.model.UserMetaData
import hu.bme.jj.appointmentapp.backend.services.user.IUserService
import jakarta.persistence.EntityNotFoundException
import org.apache.catalina.util.URLEncoder
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.io.Resource
import org.springframework.core.io.UrlResource
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import org.springframework.web.bind.annotation.*
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.getForObject
import org.springframework.web.multipart.MultipartFile
import java.io.File
import java.io.IOException
import kotlin.io.path.Path

@RestController
@RequestMapping("/users")
class UserController(private val userService: IUserService) {
    private  val restTemplate = RestTemplate()

    @Value("\${okta.oauth2.issuer}")
    private lateinit var authIssuer: String

    @Value("\${auth0.user.management.token}")
    private lateinit var authManagementToken: String

    @GetMapping("/auth/{auth0UserId}")
    fun getOrCreateUserForAuth0(@PathVariable auth0UserId: String): UserDTO {
        val user = userService.tryGetUserByAuth0Id(auth0UserId)
        return if(user != null) {
            user
        } else {
            val requestHeaders = HttpHeaders()
            requestHeaders.setBearerAuth(authManagementToken)
            val url = "${authIssuer}api/v2/users/${auth0UserId}"
            val result = restTemplate.exchange(url, HttpMethod.GET, HttpEntity<String>("", requestHeaders),
                UserMetaData::class.java
            )
            userService.createUser(UserDTO(null, result.body?.name, null, result.body?.email), auth0UserId)
        }
    }

    @GetMapping("/{id}")
    fun getUserById(@PathVariable id: Long): ResponseEntity<UserDTO> {
        return try {
            ResponseEntity.ok(userService.getUserById(id))
        } catch (e: EntityNotFoundException) {
            ResponseEntity(null, HttpStatus.NOT_FOUND)
        } catch (e: Exception) {
            ResponseEntity(null, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
/*
    @PostMapping
    fun createUser(@RequestBody entity: User): User {
        return userService.createUser(entity)
    }*/

    @PutMapping("/{id}")
    fun updateUser(@PathVariable id: Long, @RequestBody updatedUser: UserDTO): ResponseEntity<UserDTO> {
        return try {
            val result = userService.updateUser(
                UserDTO(id, updatedUser.name, updatedUser.phoneNumber, updatedUser.email)
            )
            ResponseEntity.ok(result)
        } catch (ex: Exception){
            ResponseEntity(null, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @DeleteMapping("/{id}")
    fun deleteUser(@PathVariable id: Long): ResponseEntity<String> {
        userService.deleteUser(id)
        return ResponseEntity.ok("User #$id deleted successfully.")
    }

    @PostMapping("/{id}/profile-picture")
    fun uploadProfilePicture(
        @PathVariable id: Long,
        @RequestParam("file") file: MultipartFile
    ): ResponseEntity<String> {
        val uploadDirectory = Path("uploads","profile-pictures", id.toString())
        val uploadDir = uploadDirectory.toFile()
        if (!uploadDir.exists()) {
            uploadDir.mkdirs() // Create the directory if it does not exist
        }
        uploadDir.listFiles().all {
            it.delete()
        }
        return try {
            // Save the file to the upload directory
            val fileExtension = uploadDirectory.resolve(file.originalFilename).toFile().extension
            val destinationFile = uploadDirectory.resolve("profile-picture-$id.$fileExtension").toFile()
            destinationFile.writeBytes(file.bytes)
            ResponseEntity.ok("File uploaded successfully: ${destinationFile.name}")
        } catch (e: IOException) {
            ResponseEntity("File upload failed!", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @GetMapping("/{id}/profile-picture")
    fun getProfilePicture(@PathVariable id: Long): ResponseEntity<Resource> {
        val uploadDirectory = Path("uploads","profile-pictures", id.toString())
        val profilePictureName = "profile-picture-$id"

        // Assuming the profile picture can be .png or .jpg (or other formats)
        val possibleExtensions = listOf("png", "jpg", "jpeg")

        var profilePictureFile: File? = null

        for (extension in possibleExtensions) {
            val file = uploadDirectory.resolve("$profilePictureName.$extension").toFile()
            if (file.exists()) {

                profilePictureFile = file
                break
            }
        }

        // If the profile picture exists, return it
        return if (profilePictureFile != null) {
            val mediaType = when (profilePictureFile.extension.lowercase()) {
                "png" -> MediaType.IMAGE_PNG
                "jpeg", "jpg" -> MediaType.IMAGE_JPEG
                else -> MediaType.APPLICATION_OCTET_STREAM
            }
            val resource = UrlResource(profilePictureFile.toURI())
            ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"${profilePictureFile.name}\"")
                .body(resource)
        } else {
            // Return a default image if the user has no profile picture
            return ResponseEntity(null, HttpStatus.NOT_FOUND)
        }
    }
}
