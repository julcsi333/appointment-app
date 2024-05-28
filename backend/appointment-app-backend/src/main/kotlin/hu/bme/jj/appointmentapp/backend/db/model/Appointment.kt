package hu.bme.jj.appointmentapp.backend.db.model

import jakarta.persistence.*

@Entity
@Table(name = "appointments")
class Appointment(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(nullable = false)
    var date: java.sql.Date, // Assuming you are using java.sql.Date for date

    @ManyToOne
    @JoinColumn(name = "provider_id")
    var provider: Provider,

    @ManyToOne
    @JoinColumn(name = "user_id")
    var customer: UserData,

    @ManyToOne
    @JoinColumn(name = "service_id")
    var service: Service
)