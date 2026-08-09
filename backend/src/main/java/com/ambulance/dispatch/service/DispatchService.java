package com.ambulance.dispatch.service;

import com.ambulance.dispatch.dto.IncidentDto;
import com.ambulance.dispatch.entity.Ambulance;
import com.ambulance.dispatch.entity.AmbulanceStatus;
import com.ambulance.dispatch.entity.Incident;
import com.ambulance.dispatch.entity.IncidentStatus;
import com.ambulance.dispatch.repository.AmbulanceRepository;
import com.ambulance.dispatch.repository.IncidentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DispatchService {

    @Autowired
    private IncidentRepository incidentRepository;

    @Autowired
    private AmbulanceRepository ambulanceRepository;

    public Incident reportAndDispatch(IncidentDto incidentDto) {
        Double lat = incidentDto.getLatitude();
        Double lng = incidentDto.getLongitude();

        // Query database for closest available ambulances
        List<Ambulance> availableAmbulances = ambulanceRepository.findClosestAmbulances(lat, lng, AmbulanceStatus.AVAILABLE);

        Incident incident = new Incident();
        incident.setDescription(incidentDto.getDescription());
        incident.setLatitude(lat);
        incident.setLongitude(lng);

        if (!availableAmbulances.isEmpty()) {
            Ambulance closestAmbulance = availableAmbulances.get(0);
            
            incident.setAssignedAmbulance(closestAmbulance);
            incident.setStatus(IncidentStatus.RESPONDING);
            
            closestAmbulance.setStatus(AmbulanceStatus.DISPATCHED);
            ambulanceRepository.save(closestAmbulance);
        } else {
            incident.setStatus(IncidentStatus.REPORTED);
        }

        return incidentRepository.save(incident);
    }

    public List<Ambulance> getAllAmbulances() {
        return ambulanceRepository.findAll();
    }
}
