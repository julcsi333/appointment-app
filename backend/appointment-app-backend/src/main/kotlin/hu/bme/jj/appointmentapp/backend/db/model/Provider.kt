package hu.bme.jj.appointmentapp.backend.db.model

import jakarta.persistence.*

@Entity
class Provider (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long?=null,
    @Column(nullable=false)
    val name: String,
    @Column(nullable=false)
    val address: String,

    @ManyToMany
    @JoinTable(
        name = "provider_service",
        joinColumns = [JoinColumn(name = "provider_id")],
        inverseJoinColumns = [JoinColumn(name = "service_id")]
    )
    val services: MutableSet<Service> = mutableSetOf()
) {



    /*
    override fun equals(o: Any?): Boolean {
        if (this === o) return true
        if (o !is Provider) return false
        return this.id == o.id && (this.name == o.name)
    }

    override fun hashCode(): Int {
        return Objects.hash(this.id, this.name, this.role)
    }

    override fun toString(): String {
        return "Employee{" + "id=" + this.id + ", name='" + this.name + '\'' + ", role='" + this.role + '\'' + '}'
    }*/
}