package com.araiedh.rh_absenteisme.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "leave_request")
public class Leave {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;

    @Column(name = "leave_type" ,nullable = false)
    @Enumerated(EnumType.STRING)
    private LeaveType type ;

    @Column(name = "start_date" , nullable = false )
    private LocalDate startDate ;

    @Column(name = "end_date" , nullable = false )
    private  LocalDate endDate ;

    @Column(name = "status" , nullable = false)
    @Enumerated(EnumType.STRING)
    private LeaveStatus status ;

    @Column(name = "reason" , columnDefinition = "TEXT")
    private String reason ;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id" , nullable = false )
    private User user ;




}
