package hu.bme.jj.appointmentapp.backend.db.mongo.model

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document(collection = "images") // Collection name in MongoDB
data class Image (
    @Id
    var id: String? = null,

    var fileName: String,
    var contentType: String,
    var size: Long,
    var uploadDate: java.util.Date,
    var gridFsId: String // Reference to the GridFS file ID
)