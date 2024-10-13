package hu.bme.jj.appointmentapp.backend.db.sql

import hu.bme.jj.appointmentapp.backend.db.sql.repository.*
import hu.bme.jj.appointmentapp.backend.model.EmailMessage
import hu.bme.jj.appointmentapp.backend.services.email.EmailService
import hu.bme.jj.appointmentapp.backend.services.email.IEmailService
import jakarta.annotation.PostConstruct
import org.springframework.stereotype.Component


@Component
class DevDBInitializer(
    private val providerRepository: ProviderRepository,
    private val globalServiceRepository: GlobalServiceRepository,
    private val serviceRepository: ServiceRepository,
    private val userRepository: UserRepository,
    private val auth0UserMappingRepository: Auth0UserMappingRepository,
    private val emailService: IEmailService,
) {

    @PostConstruct
    fun init() {
        // Add sample data to GlobalServiceRepository
        /*val globalServices = listOf(
            GlobalService(name = "Hairdresser", description = "Cut or style hair in order to change or maintain a person's image"),
            GlobalService(name = "Manicure", description = "Cosmetic beauty treatment for the fingernails and hands"),
            GlobalService(name = "Cosmetics", description = "Skin care and appearance enhancement.")
        )
        globalServices.forEach {
            globalServiceRepository.save(it)
        }*/

        /*
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
        }*/
    }
}