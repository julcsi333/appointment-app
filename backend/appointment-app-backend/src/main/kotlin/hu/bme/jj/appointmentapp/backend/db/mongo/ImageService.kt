package hu.bme.jj.appointmentapp.backend.db.mongo

import hu.bme.jj.appointmentapp.backend.db.mongo.model.Image
import org.springframework.stereotype.Service

@Service
class ImageService {
    fun getProfileImage(userId: Long): Image {
        "user"+userId
        TODO()
    }
    fun getSubServiceImages(subServiceId: Long): List<Image> {
        "service"+subServiceId+"??"
        TODO()
    }

}