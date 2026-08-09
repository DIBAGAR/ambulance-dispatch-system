package com.ambulance.dispatch.service;

import com.ambulance.dispatch.dto.LocationUpdateDto;
import com.ambulance.dispatch.entity.Ambulance;
import com.ambulance.dispatch.repository.AmbulanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LocationService {

    @Autowired
    private AmbulanceRepository ambulanceRepository;

    public void updateAmbulanceLocation(LocationUpdateDto locationUpdate) {
        Optional<Ambulance> ambulanceOpt = ambulanceRepository.findByVehicleNumber(locationUpdate.getVehicleNumber());
        
        if (ambulanceOpt.isPresent()) {
            Ambulance ambulance = ambulanceOpt.get();
            ambulance.setLatitude(locationUpdate.getLatitude());
            ambulance.setLongitude(locationUpdate.getLongitude());
            ambulanceRepository.save(ambulance);
        } else {
            System.err.println("Ambulance not found with vehicle number: " + locationUpdate.getVehicleNumber());
        }
    }
}
