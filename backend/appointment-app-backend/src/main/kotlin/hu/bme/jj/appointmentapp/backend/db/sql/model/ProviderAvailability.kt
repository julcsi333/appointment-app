package hu.bme.jj.appointmentapp.backend.db.sql.model

import jakarta.persistence.*

@Entity
@Table(name = "provider_availability")
class ProviderAvailability(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_id")
    var provider: Provider,

    @Column(nullable = false)
    var date: java.sql.Date,

    @Column(nullable = false)
    var startTime: java.sql.Time,

    @Column(nullable = false)
    var endTime: java.sql.Time,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "availability_rule_id")
    var providerAvailabilityRule: ProviderAvailabilityRule?,
)