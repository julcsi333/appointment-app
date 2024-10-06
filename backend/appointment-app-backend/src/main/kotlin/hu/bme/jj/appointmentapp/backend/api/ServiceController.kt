package hu.bme.jj.appointmentapp.backend.api

import hu.bme.jj.appointmentapp.backend.api.model.ServiceDTO
import hu.bme.jj.appointmentapp.backend.service.IMainServiceService
import org.springframework.core.io.Resource
import org.springframework.core.io.UrlResource
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.io.File
import java.io.IOException
import kotlin.io.path.Path


@RestController
@RequestMapping("/services")
class ServiceController(private val mainServiceService: IMainServiceService) {
    private val portfolioPicturesPath = Path("uploads", "portfolio", "services")
    @GetMapping
    fun getAllServices(): List<ServiceDTO> {
        return mainServiceService.getAllMainServices()
    }

    @GetMapping("/{id}")
    fun getServiceById(@PathVariable id: Long): ServiceDTO {
        return mainServiceService.getServiceById(id)
    }

    @GetMapping("/provider/{id}")
    fun getServicesByProviderId(@PathVariable id: Long): List<ServiceDTO> {
        return mainServiceService.getServicesByProviderId(id)
    }

    @PostMapping
    fun createService(@RequestBody service: ServiceDTO): ServiceDTO {
        return mainServiceService.createService(service)
    }

    @PutMapping("/{id}")
    fun updateService(@PathVariable id: Long, @RequestBody updatedService: ServiceDTO): ServiceDTO {
        return mainServiceService.updateService(updatedService)
    }

    @DeleteMapping("/{id}")
    fun deleteService(@PathVariable id: Long) {
        mainServiceService.deleteService(id)
    }

    @GetMapping("/{serviceId}/portfolio-pictures/{fileName}")
    fun getPortfolioPicture(@PathVariable serviceId: Long, @PathVariable fileName: String): ResponseEntity<Resource> {
        val uploadDirectory = portfolioPicturesPath.resolve(serviceId.toString())
        val portfolioPictureFile: File = uploadDirectory.resolve(fileName).toFile()

        // If the picture exists, return it
        return if (portfolioPictureFile.exists()) {
            val mediaType = when (portfolioPictureFile.extension.lowercase()) {
                "png" -> MediaType.IMAGE_PNG
                "jpeg", "jpg" -> MediaType.IMAGE_JPEG
                else -> MediaType.APPLICATION_OCTET_STREAM
            }
            val resource = UrlResource(portfolioPictureFile.toURI())
            ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"${fileName}\"")
                .body(resource)
        } else {
            // Return a default image if the user has no profile picture
            return ResponseEntity(null, HttpStatus.NOT_FOUND)
        }
    }

    @DeleteMapping("/{serviceId}/portfolio-pictures/{fileName}")
    fun deletePortfolioPicture(@PathVariable serviceId: Long, @PathVariable fileName: String): ResponseEntity<String> {
        val uploadDirectory = portfolioPicturesPath.resolve(serviceId.toString())
        val portfolioPictureFile: File = uploadDirectory.resolve(fileName).toFile()

        // If the picture exists, return it
        return if (portfolioPictureFile.exists()) {
            try {
                portfolioPictureFile.delete()
                ResponseEntity.ok("File '$fileName' successfully deleted.")
            } catch (e: IOException) {
                ResponseEntity("File '$fileName' cannot be deleted!", HttpStatus.INTERNAL_SERVER_ERROR)
            }
        } else {
            ResponseEntity("File not found.", HttpStatus.NOT_FOUND)
        }
    }

    @GetMapping("/{serviceId}/portfolio-pictures/total")
    fun getPortfolioPictureAmount(@PathVariable serviceId: Long): ResponseEntity<Int> {
        val uploadDirectory = portfolioPicturesPath.resolve(serviceId.toString()).toFile()
        if (!uploadDirectory.exists()) {
            return ResponseEntity(0, HttpStatus.OK)
        }
        return ResponseEntity(uploadDirectory.listFiles().size, HttpStatus.OK)
    }

    @GetMapping("/{serviceId}/portfolio-pictures", params = ["from", "amount"])
    fun getPortfolioPictureNames(@PathVariable serviceId: Long, @RequestParam from: Int, @RequestParam amount: Int): ResponseEntity<List<String>> {
        val uploadDirectory = portfolioPicturesPath.resolve(serviceId.toString()).toFile()
        if (!uploadDirectory.exists()) {
            return ResponseEntity(listOf(), HttpStatus.OK)
        }
        val pictureFiles = uploadDirectory.listFiles()
        pictureFiles.sortBy {
            it.lastModified()
        }
        val pictureNames = pictureFiles.map {
            it.name
        }
        return ResponseEntity(pictureNames.subList(from.coerceAtMost(pictureNames.size), (from+amount).coerceAtMost(pictureNames.size)), HttpStatus.OK)
    }

    @PostMapping("/{serviceId}/portfolio-pictures")
    fun uploadPortfolioPicture(
        @PathVariable serviceId: Long,
        @RequestParam("file") file: MultipartFile
    ): ResponseEntity<String> {
        val uploadDirectory = portfolioPicturesPath.resolve(serviceId.toString())
        val uploadDir = uploadDirectory.toFile()
        if (!uploadDir.exists()) {
            uploadDir.mkdirs() // Create the directory if it does not exist
        }
        return try {
            // Save the file to the upload directory
            val destinationFile = uploadDirectory.resolve(file.originalFilename).toFile()
            destinationFile.writeBytes(file.bytes)
            ResponseEntity.ok("File uploaded successfully: ${destinationFile.name}")
        } catch (e: IOException) {
            ResponseEntity("File upload failed!", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

}