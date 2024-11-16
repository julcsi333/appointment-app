package hu.bme.jj.appointmentapp.backend.db.sql.repository

import hu.bme.jj.appointmentapp.backend.db.sql.model.Provider
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.util.*

interface ProviderRepository : JpaRepository<Provider, Long> {
    fun findByUserId(userId: Long): Optional<Provider>

    // 1. No filters, just order by lowest sub-service price
    @Query("""
        SELECT p FROM Provider p
        JOIN p.mainServices ms
        JOIN ms.subServices ss
        GROUP BY p.id
        ORDER BY MIN(ss.price)
    """)
    fun findAllByFormOrderedByLowestPrice(): List<Provider>

    // 2. Filter by namePart only
    @Query("""
        SELECT p FROM Provider p
        JOIN p.user u
        JOIN p.mainServices ms
        JOIN ms.subServices ss
        WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :namePart, '%'))
        GROUP BY p.id
        ORDER BY MIN(ss.price)
    """)
    fun findAllByFormOrderedByLowestPrice(
        @Param("namePart") namePart: String
    ): List<Provider>

    // 3. Filter by namePart and globalServiceId
    @Query("""
        SELECT p FROM Provider p
        JOIN p.user u
        JOIN p.mainServices ms
        JOIN ms.subServices ss
        WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :namePart, '%'))
          AND ms.globalService.id = :globalServiceId
        GROUP BY p.id
        ORDER BY MIN(ss.price)
    """)
    fun findAllByFormOrderedByLowestPrice(
        @Param("namePart") namePart: String,
        @Param("globalServiceId") globalServiceId: Long
    ): List<Provider>

    // 4. Filter by namePart, globalServiceId, and subServiceName
    @Query("""
        SELECT p FROM Provider p
        JOIN p.user u
        JOIN p.mainServices ms
        JOIN ms.subServices ss
        WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :namePart, '%'))
          AND ms.globalService.id = :globalServiceId
          AND LOWER(ss.name) = LOWER(:subServiceName)
        GROUP BY p.id
        ORDER BY MIN(ss.price)
    """)
    fun findAllByFormOrderedByLowestPrice(
        @Param("namePart") namePart: String,
        @Param("globalServiceId") globalServiceId: Long,
        @Param("subServiceName") subServiceName: String
    ): List<Provider>

    @Query("""
        SELECT p FROM Provider p
        JOIN p.mainServices ms
        JOIN ms.subServices ss
        GROUP BY p.id
        ORDER BY AVG(ss.price)
    """)
    fun findAllByFormOrderedByAveragePrice(): List<Provider>

    // 2. Filter by namePart only
    @Query("""
        SELECT p FROM Provider p
        JOIN p.user u
        JOIN p.mainServices ms
        JOIN ms.subServices ss
        WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :namePart, '%'))
        GROUP BY p.id
        ORDER BY AVG(ss.price)
    """)
    fun findAllByFormOrderedByAveragePrice(
        @Param("namePart") namePart: String
    ): List<Provider>

    // 3. Filter by namePart and globalServiceId
    @Query("""
        SELECT p FROM Provider p
        JOIN p.user u
        JOIN p.mainServices ms
        JOIN ms.subServices ss
        WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :namePart, '%'))
          AND ms.globalService.id = :globalServiceId
        GROUP BY p.id
        ORDER BY AVG(ss.price)
    """)
    fun findAllByFormOrderedByAveragePrice(
        @Param("namePart") namePart: String,
        @Param("globalServiceId") globalServiceId: Long
    ): List<Provider>

    // 4. Filter by namePart, globalServiceId, and subServiceName
    @Query("""
        SELECT p FROM Provider p
        JOIN p.user u
        JOIN p.mainServices ms
        JOIN ms.subServices ss
        WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :namePart, '%'))
          AND ms.globalService.id = :globalServiceId
          AND LOWER(ss.name) = LOWER(:subServiceName)
        GROUP BY p.id
        ORDER BY AVG(ss.price)
    """)
    fun findAllByFormOrderedByAveragePrice(
        @Param("namePart") namePart: String,
        @Param("globalServiceId") globalServiceId: Long,
        @Param("subServiceName") subServiceName: String
    ): List<Provider>

    @Query("""
        SELECT p 
        FROM Provider p
        LEFT JOIN p.appointments a ON a.date >= CURRENT_DATE
        GROUP BY p.id
        ORDER BY COUNT(a.id) DESC
    """)
    fun findAllByFormOrderedByPopularity(): List<Provider>

    // 2. Filter by namePart only
    @Query("""
        SELECT p 
        FROM Provider p
        JOIN p.user u
        LEFT JOIN p.appointments a ON a.date >= CURRENT_DATE
        WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :namePart, '%'))
        GROUP BY p.id
        ORDER BY COUNT(a.id) DESC
    """)
    fun findAllByFormOrderedByPopularity(
        @Param("namePart") namePart: String
    ): List<Provider>

    // 3. Filter by namePart and globalServiceId
    @Query("""
        SELECT p FROM Provider p
        JOIN p.user u
        JOIN p.mainServices ms
        LEFT JOIN p.appointments a ON a.date >= CURRENT_DATE
        WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :namePart, '%'))
          AND ms.globalService.id = :globalServiceId
        GROUP BY p.id
        ORDER BY COUNT(a.id) DESC
    """)
    fun findAllByFormOrderedByPopularity(
        @Param("namePart") namePart: String,
        @Param("globalServiceId") globalServiceId: Long
    ): List<Provider>

    // 4. Filter by namePart, globalServiceId, and subServiceName
    @Query("""
        SELECT p FROM Provider p
        JOIN p.user u
        JOIN p.mainServices ms
        JOIN ms.subServices ss
        LEFT JOIN p.appointments a ON a.date >= CURRENT_DATE
        WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :namePart, '%'))
          AND ms.globalService.id = :globalServiceId
          AND LOWER(ss.name) = LOWER(:subServiceName)
        GROUP BY p.id
        ORDER BY COUNT(a.id) DESC
    """)
    fun findAllByFormOrderedByPopularity(
        @Param("namePart") namePart: String,
        @Param("globalServiceId") globalServiceId: Long,
        @Param("subServiceName") subServiceName: String
    ): List<Provider>
}