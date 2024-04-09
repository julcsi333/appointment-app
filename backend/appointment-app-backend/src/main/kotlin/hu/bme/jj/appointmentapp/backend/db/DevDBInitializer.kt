package hu.bme.jj.appointmentapp.backend.db

import hu.bme.jj.appointmentapp.backend.db.model.Customer
import hu.bme.jj.appointmentapp.backend.db.model.Provider
import hu.bme.jj.appointmentapp.backend.db.model.Service
import hu.bme.jj.appointmentapp.backend.db.repository.CustomerRepository
import hu.bme.jj.appointmentapp.backend.db.repository.ProviderRepository
import hu.bme.jj.appointmentapp.backend.db.repository.ServiceRepository
import jakarta.annotation.PostConstruct
import org.springframework.stereotype.Component
import kotlin.random.Random


@Component
class DevDBInitializer(
    private val providerRepository: ProviderRepository,
    private val serviceRepository: ServiceRepository,
    private val customerRepository: CustomerRepository
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
            Provider(name = "John Wick", phoneNumber = "0611123456", businessAddress = "Pécs, Széchenyi tér"),
            Provider(name = "John Cena", phoneNumber = "0611234567", businessAddress = "Pécs, Zsolnay múzeum"),
            Provider(name = "John Doe", phoneNumber = "0611345678", businessAddress = "Pécs, Zsolnay tér")
        )

        val random = Random(42)
        providers.forEach {
            val numServices = random.nextInt(1, 4)
            val shuffledServices = services.shuffled()
            val assignedServices = shuffledServices.take(numServices)
            it.services.addAll(assignedServices)
            providerRepository.save(it)
        }

        val customers = listOf(
            Customer(name = "Adam Sandler", phoneNumber = "0600123456"),
            Customer(name = "Melanie Martinez", phoneNumber = "0600234567"),
            Customer(name = "Jane Doe", phoneNumber = "0600345678")
        )

        customers.forEach {
            customerRepository.save(it)
        }
    }
}