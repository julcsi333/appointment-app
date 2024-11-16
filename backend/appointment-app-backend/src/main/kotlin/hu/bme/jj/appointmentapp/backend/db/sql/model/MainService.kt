package hu.bme.jj.appointmentapp.backend.db.sql.model

import jakarta.persistence.*

@Entity
@Table(name = "services")
class MainService (
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    @Column(nullable=true)
    val description: String,


    // Many-to-One relationship with Provider
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "provider_id", nullable = false)
    val provider: Provider,

    // Many-to-One relationship with GlobalService
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "global_service_id", nullable = false)
    val globalService: GlobalService,

    @OneToMany(mappedBy = "mainService", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    val subServices: List<SubService> = mutableListOf()
    )
