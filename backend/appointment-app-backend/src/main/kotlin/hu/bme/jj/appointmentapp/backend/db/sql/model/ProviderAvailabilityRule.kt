package hu.bme.jj.appointmentapp.backend.db.sql.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table

@Entity
@Table(name = "provider_availability_rule")
class ProviderAvailabilityRule(
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

    @Column(nullable = true)
    var repeatMonthCount: Long = 0,
)