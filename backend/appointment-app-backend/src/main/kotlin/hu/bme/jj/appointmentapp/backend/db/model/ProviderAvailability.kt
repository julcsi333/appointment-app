package hu.bme.jj.appointmentapp.backend.db.model

import jakarta.persistence.*

@Entity
@Table(name = "provider_availability")
class ProviderAvailability(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @ManyToOne
    @JoinColumn(name = "provider_id")
    var provider: Provider,

    @Column(nullable = false)
    var date: java.sql.Date,
)