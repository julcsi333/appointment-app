package hu.bme.jj.appointmentapp.backend.db.model

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.*

@Entity
@Table(name = "services")
class Service (
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0,
    val name: String,

    @ManyToMany(mappedBy = "services")
    @JsonIgnore
    val providers: MutableSet<Provider> = mutableSetOf()
)