package com.araiedh.rh_absenteisme.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Entity
@Table(name = "contrat")
public class Contrat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ContratType type ;

    @Column(name = "base_salary" , nullable = false)
    private BigDecimal baseSalary ;

    @Column(name = "signature_date" , nullable = false)
    private LocalDate signatureDate ;

    @Column(name = "start_date" , nullable = false)
    private  LocalDate startDate ;

    @Column(name = "end_date" , nullable = false)
    private LocalDate endDate ;

    @Column(name = "contrat_status" , nullable = false)
    @Enumerated(EnumType.STRING)
    private ContratStatus status ;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id" , nullable = false)
    private User user ;

}
