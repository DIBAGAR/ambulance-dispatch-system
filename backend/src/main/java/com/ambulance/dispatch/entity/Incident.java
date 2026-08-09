package com.ambulance.dispatch.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "incidents")
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String description;

    private Double latitude;
    private Double longitude;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IncidentStatus status;

    @ManyToOne
    @JoinColumn(name = "assigned_ambulance_id", referencedColumnName = "id")
    private Ambulance assignedAmbulance;

    public Incident() {
    }

    public Incident(String description, Double latitude, Double longitude, IncidentStatus status, Ambulance assignedAmbulance) {
        this.description = description;
        this.latitude = latitude;
        this.longitude = longitude;
        this.status = status;
        this.assignedAmbulance = assignedAmbulance;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public IncidentStatus getStatus() {
        return status;
    }

    public void setStatus(IncidentStatus status) {
        this.status = status;
    }

    public Ambulance getAssignedAmbulance() {
        return assignedAmbulance;
    }

    public void setAssignedAmbulance(Ambulance assignedAmbulance) {
        this.assignedAmbulance = assignedAmbulance;
    }
}
