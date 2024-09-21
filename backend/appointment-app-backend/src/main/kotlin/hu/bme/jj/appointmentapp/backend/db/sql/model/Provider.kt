package hu.bme.jj.appointmentapp.backend.db.sql.model

import jakarta.persistence.*

@Entity
@Table(name = "providers")
class Provider (
    name: String,
    phoneNumber: String,
    @Column(nullable=false)
    val businessAddress: String,
) : UserData(null, name, phoneNumber) {



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