package com.araiedh.rh_absenteisme.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey ;

    @Value("${jwt.expiration}")
    private long expiration ;

    public String generateToken(UserDetails userDetails) {
        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes()) ;
        return Jwts.builder ()
                .subject(userDetails.getUsername())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(key)
                .compact() ;
    }

}
