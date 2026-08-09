package com.ambulance.dispatch.service;

import com.ambulance.dispatch.dto.IncidentDto;
import com.ambulance.dispatch.entity.Ambulance;
import com.ambulance.dispatch.entity.AmbulanceStatus;
import com.ambulance.dispatch.entity.Incident;
import com.ambulance.dispatch.entity.IncidentStatus;
import com.ambulance.dispatch.repository.AmbulanceRepository;
import com.ambulance.dispatch.repository.IncidentRepository;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DispatchService {

    @Autowired
    private IncidentRepository incidentRepository;

    @Autowired
    private AmbulanceRepository ambulanceRepository;

    private final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

    public Incident reportAndDispatch(IncidentDto incidentDto) {
        Point incidentLocation = geometryFactory.createPoint(new Coordinate(incidentDto.getLongitude(), incidentDto.getLatitude()));

        // Query database for all available ambulances, sorted by ST_Distance
        List<Ambulance> availableAmbulances = ambulanceRepository.findClosestAmbulances(incidentLocation, AmbulanceStatus.AVAILABLE);

        Incident incident = new Incident();
        incident.setDescription(incidentDto.getDescription());
        incident.setLocation(incidentLocation);

        if (!availableAmbulances.isEmpty()) {
            // Take the closest one
            Ambulance closestAmbulance = availableAmbulances.get(0);
            
            // Assign it to the incident
            incident.setAssignedAmbulance(closestAmbulance);
            incident.setStatus(IncidentStatus.RESPONDING);
            
            // Update the ambulance status
            closestAmbulance.setStatus(AmbulanceStatus.DISPATCHED);
            ambulanceRepository.save(closestAmbulance);
        } else {
            // No ambulances available right now, leave it in queue
            incident.setStatus(IncidentStatus.REPORTED);
        }

        return incidentRepository.save(incident);
    }
}
