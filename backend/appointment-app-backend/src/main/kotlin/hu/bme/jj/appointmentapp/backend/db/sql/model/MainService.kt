package hu.bme.jj.appointmentapp.backend.db.sql.model

import jakarta.persistence.*

@Entity
@Table(name = "services")
class MainService (
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,
    @Column(nullable=false)
    var description: String,


    // Many-to-One relationship with Provider
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "provider_id", nullable = false)
    var provider: Provider,

    // Many-to-One relationship with GlobalService
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "global_service_id", nullable = false)
    var globalService: GlobalService
    )
