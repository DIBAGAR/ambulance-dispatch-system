package com.ambulance.dispatch.repository;

import com.ambulance.dispatch.entity.Ambulance;
import com.ambulance.dispatch.entity.AmbulanceStatus;
import org.locationtech.jts.geom.Point;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AmbulanceRepository extends JpaRepository<Ambulance, Long> {

    @Query("SELECT a FROM Ambulance a WHERE a.status = :status ORDER BY ST_Distance(a.currentLocation, :incidentLocation) ASC")
    List<Ambulance> findClosestAmbulances(@Param("incidentLocation") Point incidentLocation, @Param("status") AmbulanceStatus status);

    Optional<Ambulance> findByVehicleNumber(String vehicleNumber);
}
