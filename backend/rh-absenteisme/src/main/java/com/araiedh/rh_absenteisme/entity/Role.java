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
@Table(name = "role")
public class Role {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;

    @Enumerated(EnumType.STRING)
    @Column(name = "name", nullable = false)
    private RoleName name ;

    @OneToMany(mappedBy = "role")
    private List<User> users = new ArrayList<>() ;
}
