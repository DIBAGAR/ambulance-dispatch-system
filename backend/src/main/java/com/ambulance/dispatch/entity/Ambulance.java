package com.ambulance.dispatch.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ambulances")
public class Ambulance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String vehicleNumber;

    private Double latitude = 20.5937;
    private Double longitude = 78.9629;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AmbulanceStatus status;

    @OneToOne
    @JoinColumn(name = "driver_id", referencedColumnName = "id")
    private User driver;

    public Ambulance() {
    }

    public Ambulance(String vehicleNumber, Double latitude, Double longitude, AmbulanceStatus status, User driver) {
        this.vehicleNumber = vehicleNumber;
        this.latitude = latitude;
        this.longitude = longitude;
        this.status = status;
        this.driver = driver;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public AmbulanceStatus getStatus() {
        return status;
    }

    public void setStatus(AmbulanceStatus status) {
        this.status = status;
    }

    public User getDriver() {
        return driver;
    }

    public void setDriver(User driver) {
        this.driver = driver;
    }
}
