package com.smarthospital.emergencyresponsesystem.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ambulance")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ambulance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String vehicleNumber;

    private String driverName;

    private String driverContact;

    private Double currentLatitude;

    private Double currentLongitude;

    @Column(nullable = false)
    private String status; // "AVAILABLE", "ON_DUTY", "OFFLINE"

    private Long assignedHospitalId;
}