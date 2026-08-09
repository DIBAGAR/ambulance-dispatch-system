package com.ambulance.dispatch.controller;

import com.ambulance.dispatch.dto.IncidentDto;
import com.ambulance.dispatch.entity.Incident;
import com.ambulance.dispatch.service.DispatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/dispatch")
public class DispatchController {

    @Autowired
    private DispatchService dispatchService;

    @PostMapping("/report")
    @PreAuthorize("hasAnyRole('DISPATCHER', 'ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<?> reportIncident(@RequestBody IncidentDto incidentDto) {
        try {
            Incident incident = dispatchService.reportAndDispatch(incidentDto);
            
            if (incident.getAssignedAmbulance() != null) {
                return ResponseEntity.ok("Incident reported and Ambulance " + 
                        incident.getAssignedAmbulance().getVehicleNumber() + " dispatched! Incident ID: " + incident.getId());
            } else {
                return ResponseEntity.ok("Incident reported but no ambulances are currently available. Placed in queue. Incident ID: " + incident.getId());
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to report incident: " + e.getMessage());
        }
    }

    @GetMapping("/ambulances")
    @PreAuthorize("hasAnyRole('DISPATCHER', 'ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<?> getAllAmbulances() {
        return ResponseEntity.ok(dispatchService.getAllAmbulances());
    }
}
