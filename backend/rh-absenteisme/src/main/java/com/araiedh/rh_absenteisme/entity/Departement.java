package com.araiedh.rh_absenteisme.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "departement")
public class Departement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;

    @Column(name = "name", nullable = false)
    private  String name ;

    @Column(name = "description")
    private String description ;

    @OneToMany(mappedBy = "departement")
    private List<User> users = new ArrayList<>() ;

}
