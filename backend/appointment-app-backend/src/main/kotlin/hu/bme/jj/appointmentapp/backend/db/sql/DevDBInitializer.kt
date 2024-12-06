package hu.bme.jj.appointmentapp.backend.db.sql

import hu.bme.jj.appointmentapp.backend.db.sql.model.Auth0UserMapping
import hu.bme.jj.appointmentapp.backend.db.sql.model.GlobalService
import hu.bme.jj.appointmentapp.backend.db.sql.model.MainService
import hu.bme.jj.appointmentapp.backend.db.sql.model.Provider
import hu.bme.jj.appointmentapp.backend.db.sql.model.ProviderAvailability
import hu.bme.jj.appointmentapp.backend.db.sql.model.SubService
import hu.bme.jj.appointmentapp.backend.db.sql.model.UserData
import hu.bme.jj.appointmentapp.backend.db.sql.repository.*
import hu.bme.jj.appointmentapp.backend.services.email.IEmailService
import jakarta.annotation.PostConstruct
import org.springframework.stereotype.Component
import java.sql.Date
import java.sql.Time
import java.time.LocalDate


@Component
class DevDBInitializer(
    private val providerRepository: ProviderRepository,
    private val providerAvailabilityRepository: ProviderAvailabilityRepository,
    private val globalServiceRepository: GlobalServiceRepository,
    private val serviceRepository: ServiceRepository,
    private val subServiceRepository: SubServiceRepository,
    private val userRepository: UserRepository,
    private val auth0UserMappingRepository: Auth0UserMappingRepository,
) {

    @PostConstruct
    fun init() {
        // Add sample data to GlobalServiceRepository
        if (globalServiceRepository.findAll().isEmpty()) {
            // Add global services
            val globalServices = listOf(
                GlobalService(name = "Hairdressing", description = "Cut or style hair in order to change or maintain a person's image"),
                GlobalService(name = "Manicure", description = "Cosmetic beauty treatment for the fingernails and hands"),
                GlobalService(name = "Cosmetics", description = "Skin care and appearance enhancement.")
            )
            globalServices.forEach {
                globalServiceRepository.save(it)
            }
            // Add mock users
            val mockUsers = listOf(
                UserData(id = 1, name = "Max Berger", phoneNumber = "01234556677", email = "max.berger@testmail.com"),
                UserData(id = 2, name = "Eloise Jones", phoneNumber = "01234556677", email = "eloise.jones@testmail.com"),
                UserData(id = 3, name = "Clare Gentry", phoneNumber = "01234556677", email = "clare.gentry@testmail.com"),
            ).let {
                userRepository.saveAll(it)
            }

            // Add auth0 user mapping to users
            auth0UserMappingRepository.save(Auth0UserMapping(localUser = mockUsers[0], auth0UserId = "auth0|664b6ad9f5c56fa0ab120990"))
            auth0UserMappingRepository.save(Auth0UserMapping(localUser = mockUsers[1], auth0UserId = "auth0|6749fadfd4dd142fd6387ae8"))
            auth0UserMappingRepository.save(Auth0UserMapping(localUser = mockUsers[2], auth0UserId = "auth0|6750258540af06fbdfba0f0c"))
            // Add mock providers
            val mockProviders = listOf(
                providerRepository.save(Provider(bio = "I have 10+ years experience in hairdressing.", businessAddress = "Budapest, ...", user = mockUsers[0])),
                providerRepository.save(Provider(bio = "I have 5+ years experience in manicure.", businessAddress = "***", user = mockUsers[1]))
            )
            mockProviders[0].also { p ->
                // Add services to provider
                val service = serviceRepository.save(MainService(provider = p, globalService = globalServices[0], description = "Below you can see my hairdressing services. The prices may wary based on hair length and hair type. If you bring your own dye, I can give you a discount on coloring."))
                val subServices = listOf(
                    SubService(duration = 30, name = "Haircut", price = 23.0f, mainService = service ),
                    SubService(duration = 45, name = "Hair coloring (with own dye)", price = 26.0f, mainService = service ),
                    SubService(duration = 45, name = "Hair coloring", price = 30.0f, mainService = service ),
                    SubService(duration = 60, name = "Hair bleaching", price = 30.0f, mainService = service ),
                    SubService(duration = 30, name = "Hair styling", price = 26.0f, mainService = service )
                )
                subServices.forEach {
                    subServiceRepository.save(it)
                }

                // Add availability to provider
                var date = LocalDate.now()
                for (i in 0..100) {
                    date = date.plusDays(1)
                    providerAvailabilityRepository.save(
                        ProviderAvailability(provider = p, date = Date.valueOf(date), startTime = Time.valueOf("10:00:00"), endTime = Time.valueOf("17:00:00"), providerAvailabilityRule = null)
                    )
                }
            }
            mockProviders[1].also { p ->
                // Add services to provider
                val service = serviceRepository.save(MainService(provider = p, globalService = globalServices[1], description = ""))
                listOf(
                    SubService(duration = 30, name = "Basic manicure", price = 23.0f, mainService = service ),
                    SubService(duration = 60, name = "Gel nails", price = 26.0f, mainService = service ),
                    SubService(duration = 30, name = "French nails", price = 30.0f, mainService = service ),
                    SubService(duration = 60, name = "Gel french nails", price = 30.0f, mainService = service ),
                    SubService(duration = 60, name = "Gel nails with difficult design", price = 26.0f, mainService = service )
                ).let {
                    subServiceRepository.saveAll(it)
                }

                // Add availability to provider
                var date = LocalDate.now()
                for (i in 0..100) {
                    date = date.plusDays(1)
                    providerAvailabilityRepository.save(ProviderAvailability(provider = p, date = Date.valueOf(date), startTime = Time.valueOf("8:00:00"), endTime = Time.valueOf("11:00:00"), providerAvailabilityRule = null))
                    providerAvailabilityRepository.save(ProviderAvailability(provider = p, date = Date.valueOf(date), startTime = Time.valueOf("13:00:00"), endTime = Time.valueOf("18:00:00"), providerAvailabilityRule = null))
                }
            }
        }
    }
}