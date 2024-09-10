package hu.bme.jj.appointmentapp.backend.db

import hu.bme.jj.appointmentapp.backend.db.model.Auth0UserMapping
import hu.bme.jj.appointmentapp.backend.db.model.Provider
import hu.bme.jj.appointmentapp.backend.db.model.Service
import hu.bme.jj.appointmentapp.backend.db.model.UserData
import hu.bme.jj.appointmentapp.backend.db.repository.Auth0UserMappingRepository
import hu.bme.jj.appointmentapp.backend.db.repository.ProviderRepository
import hu.bme.jj.appointmentapp.backend.db.repository.ServiceRepository
import hu.bme.jj.appointmentapp.backend.db.repository.UserRepository
import jakarta.annotation.PostConstruct
import org.springframework.stereotype.Component
import kotlin.random.Random
/*
@Component
class DevDBInitializer(
    private val providerRepository: ProviderRepository,
    private val serviceRepository: ServiceRepository,
    private val userRepository: UserRepository,
    private val auth0UserMappingRepository: Auth0UserMappingRepository,
) {

    @PostConstruct
    fun init() {
        // Add sample data to ServiceRepository
        val services = listOf(
            Service(name = "Hair dressing"),
            Service(name = "Manicure"),
            Service(name = "Massage")
        )
        services.forEach {
            serviceRepository.save(it)
        }

        // Add sample data to ProviderRepository
        val providers = listOf(
            Provider(name = "Jaime Duffy", phoneNumber = "0611123456", businessAddress = "Pécs, Széchenyi tér"),
            Provider(name = "Kelly Montoya", phoneNumber = "0611234567", businessAddress = "Pécs, Zsolnay múzeum"),
            Provider(name = "Peter Goodwin", phoneNumber = "0611345678", businessAddress = "Pécs, Zsolnay tér")
        )

        val random = Random(42)
        providers.forEach {
            val numServices = random.nextInt(1, 4)
            val shuffledServices = services.shuffled()
            val assignedServices = shuffledServices.take(numServices)
            it.services.addAll(assignedServices)
            providerRepository.save(it)
            val auth0Id = when (it.name) {
                "Jaime Duffy" -> "auth0|664b68a52eadd3e573e1c9c2"
                "Kelly Montoya" -> "auth0|664b691947c62d7f61b3049a"
                "Peter Goodwin" -> "auth0|664b697d2eadd3e573e1ca89"
                else -> TODO()
            }
            auth0UserMappingRepository.save(Auth0UserMapping(null, auth0Id, it))
        }

        val customers = listOf(
            UserData(name = "Max Berger", phoneNumber = "0600123456"),
            UserData(name = "John Doe", phoneNumber = "0600234567"),
            UserData(name = "Jane Doe", phoneNumber = "0600345678")
        )

        customers.forEach {
            userRepository.save(it)
            val auth0Id = when (it.name) {
                "Max Berger" -> "auth0|664b6ad9f5c56fa0ab120990"
                "John Doe" -> "auth0|664b6afff5c56fa0ab1209b1"
                "Jane Doe" -> "auth0|664b6b19425d6c86e6656038"
                else -> TODO()
            }
            auth0UserMappingRepository.save(Auth0UserMapping(null, auth0Id, it))
        }
    }
}*/