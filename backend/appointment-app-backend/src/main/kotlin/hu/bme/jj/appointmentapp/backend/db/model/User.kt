package hu.bme.jj.appointmentapp.backend.db.model

import jakarta.persistence.*

@MappedSuperclass
abstract class User (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long?=null,
    @Column(nullable=false)
    val name: String,
    @Column(nullable=false)
    val phoneNumber: String,
)