package hu.bme.jj.appointmentapp.backend.db.sql.model

import jakarta.persistence.*

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "user_data")
open class UserData (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    open var id: Long?=null,
    @Column(nullable=true)
    open val name: String? = null,
    @Column(nullable=true)
    open val phoneNumber: String? = null,
    @Column(nullable=true)
    open val email: String? = null,
    @Column(nullable=true)
    open val bio: String = "",
)