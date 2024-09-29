package hu.bme.jj.appointmentapp.backend.api

import hu.bme.jj.appointmentapp.backend.api.model.UserDTO
import hu.bme.jj.appointmentapp.backend.db.sql.model.UserData
import hu.bme.jj.appointmentapp.backend.service.IUserService
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/users")
class UserController(private val userService: IUserService) {
    @GetMapping("/auth/{auth0UserId}")
    fun getOrCreateUserForAuth0(@PathVariable auth0UserId: String): UserDTO {
        //SecurityContextHolder.getContext().authentication
        return userService.getOrCreateUserForAuth0(auth0UserId)
    }

    @GetMapping("/{id}")
    fun getUserById(@PathVariable id: Long): UserDTO {
        return userService.getUserById(id)
    }
/*
    @PostMapping
    fun createUser(@RequestBody entity: User): User {
        return userService.createUser(entity)
    }*/

    @PutMapping("/{id}")
    fun updateUser(@PathVariable id: Long, @RequestBody updatedUser: UserDTO): UserDTO {
        return userService.updateUser(
            UserDTO(id, updatedUser.name, updatedUser.phoneNumber, updatedUser.email, updatedUser.bio)
        )
    }

    @DeleteMapping("/{id}")
    fun deleteUser(@PathVariable id: Long) {
        userService.deleteUser(id)
    }
}
