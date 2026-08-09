package com.ambulance.dispatch.controller;

import com.ambulance.dispatch.dto.LocationUpdateDto;
import com.ambulance.dispatch.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class LocationController {

    @Autowired
    private LocationService locationService;

    @MessageMapping("/updateLocation")
    @SendTo("/topic/ambulances")
    public LocationUpdateDto broadcastLocation(LocationUpdateDto locationUpdate) {
        // Save the latest coordinates into PostgreSQL PostGIS
        locationService.updateAmbulanceLocation(locationUpdate);
        
        // Broadcast to all subscribers (dispatchers)
        return locationUpdate;
    }
}
