package hu.bme.jj.appointmentapp.backend.db.model

import jakarta.persistence.*

@Entity
class Auth0UserMapping(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long?=null,

    val auth0UserId: String,

    @OneToOne
    @JoinColumn(name = "user_id")
    val localUser: UserData
)