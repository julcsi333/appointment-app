package hu.bme.jj.appointmentapp.backend.service

import hu.bme.jj.appointmentapp.backend.api.model.GlobalServiceDTO
import hu.bme.jj.appointmentapp.backend.db.sql.model.GlobalService
import hu.bme.jj.appointmentapp.backend.db.sql.repository.GlobalServiceRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.stereotype.Service

@Service
class GlobalServiceService(private val repository: GlobalServiceRepository) : IGlobalServiceService{
    override fun getAllGlobalServices(): List<GlobalServiceDTO> {
        return repository.findAll().map { mapToDTO(it) }
    }

    override fun getGlobalServiceById(id: Long): GlobalServiceDTO {
        return mapToDTO(repository.findById(id).orElseThrow{ EntityNotFoundException("Global service not found with id $id") })
    }

    fun mapToDTO(globalService: GlobalService) : GlobalServiceDTO {
        return GlobalServiceDTO(globalService.id, globalService.name, globalService.description)
    }
}