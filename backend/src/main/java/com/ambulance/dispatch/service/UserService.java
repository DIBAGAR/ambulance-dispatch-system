package com.ambulance.dispatch.service;

import com.ambulance.dispatch.entity.Role;
import com.ambulance.dispatch.entity.User;
import com.ambulance.dispatch.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User createUser(String name, String email, String password, Role role, Long adminId) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        User user = new User(name, email, passwordEncoder.encode(password), role, adminId);
        return userRepository.save(user);
    }

    public List<User> getUsersByRole(Role role) {
        return userRepository.findAll().stream()
                .filter(user -> user.getRole() == role)
                .collect(Collectors.toList());
    }

    public List<User> getUsersByAdminId(Long adminId) {
        return userRepository.findAll().stream()
                .filter(user -> adminId.equals(user.getAdminId()))
                .collect(Collectors.toList());
    }
}
