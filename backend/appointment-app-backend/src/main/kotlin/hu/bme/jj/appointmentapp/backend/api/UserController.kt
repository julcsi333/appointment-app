package hu.bme.jj.appointmentapp.backend.api

import hu.bme.jj.appointmentapp.backend.db.model.UserData
import hu.bme.jj.appointmentapp.backend.db.service.UserService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/users")
class UserController(private val userService: UserService) {
    @GetMapping("/auth/{auth0UserId}")
    fun getOrCreateUserForAuth0(@PathVariable auth0UserId: String): UserData {
        return userService.getOrCreateUserForAuth0(auth0UserId)
    }

    @GetMapping("/{id}")
    fun getUserById(@PathVariable id: Long): UserData {
        return userService.getUserById(id)
    }
/*
    @PostMapping
    fun createUser(@RequestBody entity: User): User {
        return userService.createUser(entity)
    }*/

    @PutMapping("/{id}")
    fun updateUser(@PathVariable id: Long, @RequestBody updatedEntity: UserData): UserData {
        return userService.updateUser(id, updatedEntity)
    }

    @DeleteMapping("/{id}")
    fun deleteUser(@PathVariable id: Long) {
        userService.deleteUser(id)
    }
}
