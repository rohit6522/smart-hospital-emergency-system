

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

    private Integer bloodAPos = 0;
    private Integer bloodANeg = 0;
    private Integer bloodBPos = 0;
    private Integer bloodBNeg = 0;
    private Integer bloodOPos = 0;
    private Integer bloodONeg = 0;
    private Integer bloodABPos = 0;
    private Integer bloodABNeg = 0;



    private Integer availableDoctors;

    @ElementCollection
    @CollectionTable(name = "hospital_emergency_types", joinColumns = @JoinColumn(name = "hospital_id"))
    @Column(name = "emergency_type")
    private java.util.List<String> emergencyTypes = new java.util.ArrayList<>();

    private String contactNumber;
}