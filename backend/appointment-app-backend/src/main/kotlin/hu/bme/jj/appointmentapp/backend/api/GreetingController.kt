package hu.bme.jj.appointmentapp.backend.api

import org.openapitools.model.GetGreeting200Response
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class GreetingController {

    @GetMapping("/greet")
    fun getGreeting(): ResponseEntity<GetGreeting200Response>? {
        return ResponseEntity(HttpStatus.NOT_IMPLEMENTED)
    }
}