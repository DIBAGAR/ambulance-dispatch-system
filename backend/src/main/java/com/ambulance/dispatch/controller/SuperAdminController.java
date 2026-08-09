package com.ambulance.dispatch.controller;

import com.ambulance.dispatch.dto.UserDto;
import com.ambulance.dispatch.entity.Role;
import com.ambulance.dispatch.entity.User;
import com.ambulance.dispatch.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/superadmin")
public class SuperAdminController {

    @Autowired
    private UserService userService;

    @PostMapping("/admins")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> createAdmin(@RequestBody UserDto adminDto) {
        try {
            User newAdmin = userService.createUser(
                    adminDto.getName(), 
                    adminDto.getEmail(), 
                    adminDto.getPassword(), 
                    Role.ADMIN, 
                    null
            );
            return ResponseEntity.ok("Admin registered successfully! ID: " + newAdmin.getId());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/admins")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<User>> getAllAdmins() {
        List<User> admins = userService.getUsersByRole(Role.ADMIN);
        return ResponseEntity.ok(admins);
    }
}
