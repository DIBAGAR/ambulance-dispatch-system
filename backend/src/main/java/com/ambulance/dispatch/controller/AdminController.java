package com.ambulance.dispatch.controller;

import com.ambulance.dispatch.dto.AmbulanceDto;
import com.ambulance.dispatch.dto.UserDto;
import com.ambulance.dispatch.entity.Ambulance;
import com.ambulance.dispatch.entity.Role;
import com.ambulance.dispatch.entity.User;
import com.ambulance.dispatch.repository.UserRepository;
import com.ambulance.dispatch.security.UserDetailsImpl;
import com.ambulance.dispatch.service.AmbulanceService;
import com.ambulance.dispatch.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AmbulanceService ambulanceService;

    private Long getCurrentAdminId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userDetails.getId();
    }

    @PostMapping("/drivers")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<?> createDriver(@RequestBody UserDto driverDto) {
        try {
            User newDriver = userService.createUser(
                    driverDto.getName(),
                    driverDto.getEmail(),
                    driverDto.getPassword(),
                    Role.DRIVER,
                    getCurrentAdminId()
            );
            return ResponseEntity.ok("Driver registered successfully! ID: " + newDriver.getId());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/dispatchers")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<?> createDispatcher(@RequestBody UserDto dispatcherDto) {
        try {
            User newDispatcher = userService.createUser(
                    dispatcherDto.getName(),
                    dispatcherDto.getEmail(),
                    dispatcherDto.getPassword(),
                    Role.DISPATCHER,
                    getCurrentAdminId()
            );
            return ResponseEntity.ok("Dispatcher registered successfully! ID: " + newDispatcher.getId());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/ambulances")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<?> registerAmbulance(@RequestBody AmbulanceDto ambulanceDto) {
        try {
            User driver = null;
            if (ambulanceDto.getDriverId() != null) {
                driver = userRepository.findById(ambulanceDto.getDriverId())
                        .orElseThrow(() -> new RuntimeException("Error: Driver not found."));
            }
            
            Ambulance newAmbulance = ambulanceService.registerAmbulance(
                    ambulanceDto.getVehicleNumber(),
                    driver
            );
            return ResponseEntity.ok("Ambulance registered successfully! ID: " + newAmbulance.getId());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/users")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<List<User>> getMyUsers() {
        List<User> users = userService.getUsersByAdminId(getCurrentAdminId());
        return ResponseEntity.ok(users);
    }
}
