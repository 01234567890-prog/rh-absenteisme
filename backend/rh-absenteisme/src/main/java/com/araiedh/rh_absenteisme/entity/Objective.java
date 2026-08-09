package com.araiedh.rh_absenteisme.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Objective {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;

    @Column(name = "description")
    private String description ;

    @Column(name = "target_value" , nullable = false)
    private BigDecimal targetValue ;

    @Column(name = "achieved_value" )
    private BigDecimal achievedValue ;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private ObjectiveStatus status ;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evaluation_id" , nullable = false)
    private Evaluation evaluation ;


}
