package hu.bme.jj.appointmentapp.backend.db.model

import jakarta.persistence.Entity

@Entity
class Customer(
    name: String,
    phoneNumber: String,
) : User(null, name, phoneNumber) {

}