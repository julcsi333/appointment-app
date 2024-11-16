package hu.bme.jj.appointmentapp.backend.api.model

enum class SortByTactic(val id: Int) {
    POPULARITY(0),
    PRICE_AVG(1),
    PRICE_LOWEST(2)
}