package com.ambulance.dispatch.service;

import com.ambulance.dispatch.entity.Ambulance;
import com.ambulance.dispatch.entity.AmbulanceStatus;
import com.ambulance.dispatch.entity.User;
import com.ambulance.dispatch.repository.AmbulanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AmbulanceService {

    @Autowired
    private AmbulanceRepository ambulanceRepository;

    public Ambulance registerAmbulance(String vehicleNumber, User driver) {
        // Validation check for unique vehicle number is handled by unique constraint in DB, 
        // but we could explicitly check here.

        Ambulance ambulance = new Ambulance(vehicleNumber, null, AmbulanceStatus.AVAILABLE, driver);
        return ambulanceRepository.save(ambulance);
    }

    public List<Ambulance> getAllAmbulances() {
        return ambulanceRepository.findAll();
    }
}
