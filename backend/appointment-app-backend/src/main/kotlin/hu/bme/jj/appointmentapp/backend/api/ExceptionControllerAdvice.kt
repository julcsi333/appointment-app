package hu.bme.jj.appointmentapp.backend.api

import jakarta.persistence.EntityNotFoundException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler

@ControllerAdvice
class ExceptionControllerAdvice {
    @ExceptionHandler
    fun handleIllegalArgumentException(ex: IllegalArgumentException): ResponseEntity<String> {
        return ResponseEntity("Illegal argument: " + ex.message, HttpStatus.BAD_REQUEST)
    }

    @ExceptionHandler
    fun handleIllegalStateException(ex: EntityNotFoundException): ResponseEntity<String> {
        return ResponseEntity("Entity not found", HttpStatus.NOT_FOUND)
    }
}