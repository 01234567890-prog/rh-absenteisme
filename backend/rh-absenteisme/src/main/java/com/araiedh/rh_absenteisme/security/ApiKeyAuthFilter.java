package com.araiedh.rh_absenteisme.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class ApiKeyAuthFilter extends OncePerRequestFilter {

    @Value("${ai.api-key}")
    private String validApiKey;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        System.out.println("API KEY FILTER HIT , header : " + request.getHeader("X-API-KEY"));
        String apiKey = request.getHeader("X-API-KEY") ;
        if (apiKey != null && apiKey.equals(validApiKey)) {
            var authToken = new UsernamePasswordAuthenticationToken("ai-service" , null , List.of(new SimpleGrantedAuthority("ROLE_AI_SERVICE")));
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }
        filterChain.doFilter(request , response);
    }
}
