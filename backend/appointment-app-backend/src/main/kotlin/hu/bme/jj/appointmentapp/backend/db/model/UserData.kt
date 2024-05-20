package hu.bme.jj.appointmentapp.backend.db.model

import jakarta.persistence.*

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
open class UserData (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    open var id: Long?=null,
    @Column(nullable=true)
    open val name: String? = null,
    @Column(nullable=true)
    open val phoneNumber: String? = null,
)