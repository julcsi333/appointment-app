package hu.bme.jj.appointmentapp.backend.db

import hu.bme.jj.appointmentapp.backend.db.model.Provider
import hu.bme.jj.appointmentapp.backend.db.model.Service
import hu.bme.jj.appointmentapp.backend.db.repository.ProviderRepository
import hu.bme.jj.appointmentapp.backend.db.repository.ServiceRepository
import jakarta.annotation.PostConstruct
import org.springframework.stereotype.Component


@Component
class DevDBInitializer(
    private val providerRepository: ProviderRepository,
    private val serviceRepository: ServiceRepository
) {

    @PostConstruct
    fun init() {
        // Add sample data to ProviderRepository
        val provider1 = Provider(name = "John Wick", address = "Pécs, Széchenyi tér")
        val provider2 = Provider(name = "John Cena", address = "Pécs, Zsolnay múzeum")
        providerRepository.save(provider1)
        providerRepository.save(provider2)

        // Add sample data to ServiceRepository
        val service1 = Service(name = "Hair dressing")
        val service2 = Service(name = "Manicure")
        serviceRepository.save(service1)
        serviceRepository.save(service2)

        // Associate services with providers
        provider1.services.add(service1)
        provider1.services.add(service2)
        providerRepository.save(provider1)

        provider2.services.add(service1)
        providerRepository.save(provider2)
    }
}