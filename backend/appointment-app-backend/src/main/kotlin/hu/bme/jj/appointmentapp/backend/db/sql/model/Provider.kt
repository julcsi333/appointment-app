package hu.bme.jj.appointmentapp.backend.db.sql.model

import jakarta.persistence.*

@Entity
@Table(name = "providers")
class Provider (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,
    @Column(nullable=false)
    val businessAddress: String,
    @Column(nullable=false)
    val sendDailyAppointmentReport: Boolean = true,
    @OneToOne(optional = false)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    var user: UserData  // Non-nullable
)