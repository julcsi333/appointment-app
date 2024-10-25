package hu.bme.jj.appointmentapp.backend.db.sql.model

import jakarta.persistence.*

@Entity
@Table(name = "user_data")
open class UserData (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    open var id: Long?=null,
    @Column(nullable=true)
    open var name: String? = null,
    @Column(nullable=true)
    open var phoneNumber: String? = null,
    @Column(nullable=true)
    open var email: String? = null,
    @Column(nullable=false)
    open var sendDailyAppointmentNotification: Boolean = true,
    @OneToOne(mappedBy = "user", cascade = [CascadeType.ALL], orphanRemoval = true)
    open var provider: Provider? = null  // Nullable
)