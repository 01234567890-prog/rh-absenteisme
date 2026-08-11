package com.araiedh.rh_absenteisme.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@Entity
@Table(name = "presence")
public class Presence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;

    @Column(name = "date" , nullable = false)
    private LocalDate date ;

    @Column(name = "check_in_time" , nullable = false )
    private LocalTime checkInTime ;

    @Column(name = "check_out_time" , nullable = false)
    private LocalTime checkOutTime ;

    @Column(name = "status" , nullable = false)
    @Enumerated(EnumType.STRING)
    private PresenceStatus status ;



    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id" , nullable = false)
    private User user ;
}
