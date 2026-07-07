package com.smarthospital.emergencyresponsesystem.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "patient")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private Integer age;

    private String gender;

    private String contactNumber;

    private String bloodGroup;

    @Column(length = 1000)
    private String medicalHistory; // allergies, past conditions, medications etc.

    private String emergencyContactName;

    private String emergencyContactNumber;
}