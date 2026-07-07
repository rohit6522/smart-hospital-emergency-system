

package com.smarthospital.emergencyresponsesystem.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "hospital")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Hospital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String address;

    private Double latitude;

    private Double longitude;

    private Integer totalIcuBeds;

    private Integer availableIcuBeds;

    private Boolean bloodBankAvailable;

    private Integer availableDoctors;

    @Column(nullable = false)
    private String emergencyType; // e.g. "Cardiac", "Trauma", "General", "Pediatric"

    private String contactNumber;
}