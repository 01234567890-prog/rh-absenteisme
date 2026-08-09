package com.araiedh.rh_absenteisme.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CollectionIdMutability;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Evaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;

    @Column(name = "period" , nullable = false)
    @Enumerated(EnumType.STRING)
    private EvaluationPeriod period ;

    @Column(name = "performance_score" , nullable = false)
    private BigDecimal performanceScore ;

    @Column(name = "competency_score" , nullable = false)
    private BigDecimal competencyScore ;

    @Column(name = "behavior_score" , nullable = false)
    private BigDecimal behaviorScore ;

    @Column(name = "evaluation_date" , nullable = false)
    private LocalDate evaluationDate ;

    @Column(name = "comment")
    private String comment ;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evaluated_user_id" , nullable = false)
    private User evaluatedUser ;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evaluator_id" , nullable = false)
    private User evaluator ;

    @OneToMany(mappedBy = "evaluation" , fetch = FetchType.LAZY)
    private List<Objective> objectives = new ArrayList<>() ;

}
