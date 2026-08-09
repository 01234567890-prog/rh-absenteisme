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
@Table(name = "positions")
public class Position {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;

    @Column(name = "title" , nullable = false)
    private String title ;

    @Column(name = "description")
    private String description ;

    @OneToMany(mappedBy = "position")
    private List<User> users = new ArrayList<>() ;

}
