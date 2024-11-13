package hu.bme.jj.appointmentapp.backend.config

import org.springframework.context.annotation.Configuration
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
@EnableScheduling
class Configuration : WebMvcConfigurer {

    override fun addCorsMappings(registry: CorsRegistry) {
        registry.addMapping("/**")
            .allowedOrigins("*")
            .allowedMethods("GET", "POST", "PUT", "DELETE")
            .allowedHeaders("Content-Type", "Authorization")
    }

    companion object {
        val emailRegex = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]".toRegex()

        val phoneRegex = "^[\\d\\s()-]".toRegex()
    }
}