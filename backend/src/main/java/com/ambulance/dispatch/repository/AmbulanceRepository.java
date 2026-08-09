package com.ambulance.dispatch.repository;

import com.ambulance.dispatch.entity.Ambulance;
import com.ambulance.dispatch.entity.AmbulanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AmbulanceRepository extends JpaRepository<Ambulance, Long> {

    @Query("SELECT a FROM Ambulance a WHERE a.status = :status ORDER BY ((a.latitude - :lat)*(a.latitude - :lat) + (a.longitude - :lng)*(a.longitude - :lng)) ASC")
    List<Ambulance> findClosestAmbulances(@Param("lat") Double lat, @Param("lng") Double lng, @Param("status") AmbulanceStatus status);

    Optional<Ambulance> findByVehicleNumber(String vehicleNumber);
}
