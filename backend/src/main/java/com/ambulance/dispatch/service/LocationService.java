package com.ambulance.dispatch.service;

import com.ambulance.dispatch.dto.LocationUpdateDto;
import com.ambulance.dispatch.entity.Ambulance;
import com.ambulance.dispatch.repository.AmbulanceRepository;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LocationService {

    @Autowired
    private AmbulanceRepository ambulanceRepository;

    private final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

    public void updateAmbulanceLocation(LocationUpdateDto locationUpdate) {
        Optional<Ambulance> ambulanceOpt = ambulanceRepository.findByVehicleNumber(locationUpdate.getVehicleNumber());
        
        if (ambulanceOpt.isPresent()) {
            Ambulance ambulance = ambulanceOpt.get();
            Point newLocation = geometryFactory.createPoint(new Coordinate(locationUpdate.getLongitude(), locationUpdate.getLatitude()));
            ambulance.setCurrentLocation(newLocation);
            ambulanceRepository.save(ambulance);
        } else {
            System.err.println("Ambulance not found with vehicle number: " + locationUpdate.getVehicleNumber());
        }
    }
}
