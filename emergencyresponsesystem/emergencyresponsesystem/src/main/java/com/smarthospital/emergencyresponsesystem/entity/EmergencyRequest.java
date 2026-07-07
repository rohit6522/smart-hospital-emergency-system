package com.smarthospital.emergencyresponsesystem.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "emergency_request")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmergencyRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long patientId;

    private Long hospitalId;

    private Long ambulanceId;

    @Column(nullable = false)
    private String emergencyType; // "Cardiac", "Trauma", "Accident" etc.

    private Double pickupLatitude;

    private Double pickupLongitude;

    @Column(nullable = false)
    private String status; // "REQUESTED", "AMBULANCE_ASSIGNED", "IN_TRANSIT", "COMPLETED", "CANCELLED"

    private LocalDateTime requestTime;

    private LocalDateTime completionTime;

    private Double estimatedArrivalMinutes;
}