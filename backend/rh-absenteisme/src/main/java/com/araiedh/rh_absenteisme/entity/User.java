package com.araiedh.rh_absenteisme.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;

    @Column(name = "first_name" , nullable = false)
    private String firstName ;

    @Column(name = "last_name" , nullable = false)
    private String lastName ;

    @Column(name = "phone_number" , unique = true)
    private String phoneNumber ;

    @Column(name = "email" , nullable = false , unique = true)
    private String email ;
    @Column(name = "password" , nullable = false )
    private  String password ;

    @CreatedDate
    @Column( name = "created_date", updatable = false ,  nullable = false)
    private LocalDateTime createdDate ;


    @Column(name = "hire_date", nullable = false)
    private LocalDate hireDate ;

    @Enumerated(EnumType.STRING)
    private UserStatus status ;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "departement_id")
    private Departement departement ;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id")
    private Role role ;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "position_id")
    private Position position ;

    @OneToMany(mappedBy = "user" , fetch = FetchType.LAZY)
    private List<Contrat> contrats = new ArrayList<>() ;

    @OneToMany(mappedBy = "user")
    private List<Leave> leaves = new ArrayList<>() ;

    @OneToMany(mappedBy = "user" , fetch = FetchType.LAZY)
    private List<Presence> presences = new ArrayList<>() ;

    @OneToMany(mappedBy = "evaluatedUser" , fetch = FetchType.LAZY)
    private List<Evaluation> evaluationReceived = new ArrayList<>() ;

    @OneToMany(mappedBy = "evaluator" , fetch = FetchType.LAZY)
    private List<Evaluation> evaluationGiven = new ArrayList<>() ;


    @OneToMany(mappedBy = "user" , fetch = FetchType.LAZY)
    private  List<AbsenteeismPrediction> predictions = new ArrayList<>() ;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.getName().name()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true ;
    }

    @Override
    public boolean isAccountNonLocked() {
        return status != UserStatus.SUSPENDED ;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true ;
    }

    @Override
    public boolean isEnabled() {
        return status == UserStatus.ACTIVE ;
    }
}
