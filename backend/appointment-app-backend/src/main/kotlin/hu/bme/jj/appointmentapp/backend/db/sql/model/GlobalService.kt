package hu.bme.jj.appointmentapp.backend.db.sql.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "global_services")
class GlobalService (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,
    @Column(nullable=false)
    val name: String,
    @Column(nullable=false)
    var description: String,
)