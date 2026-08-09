package com.araiedh.rh_absenteisme;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class RhAbsenteismeApplication {

	public static void main(String[] args) {SpringApplication.run(RhAbsenteismeApplication.class, args);
	}

}
