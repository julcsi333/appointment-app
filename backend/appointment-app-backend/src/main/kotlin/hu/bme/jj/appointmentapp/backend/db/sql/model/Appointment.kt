package hu.bme.jj.appointmentapp.backend.db.sql.model

import jakarta.persistence.*

@Entity
@Table(name = "appointments")
class Appointment(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(nullable = false)
    var date: java.sql.Date,

    @ManyToOne
    @JoinColumn(name = "provider_id")
    var provider: Provider,

    @ManyToOne
    @JoinColumn(name = "user_id")
    var customer: UserData,

    @ManyToOne
    @JoinColumn(name = "service_id")
    var mainService: MainService
)