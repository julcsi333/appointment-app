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

    @Column(nullable = false)
    var startTime: java.sql.Time,

    @Column(nullable = false)
    var endTime: java.sql.Time,

    @ManyToOne
    @JoinColumn(name = "provider_id")
    var provider: Provider,

    @ManyToOne
    @JoinColumn(name = "user_id")
    var customer: UserData,

    @ManyToOne
    @JoinColumn(name = "sub_service_id")
    var subService: SubService
)