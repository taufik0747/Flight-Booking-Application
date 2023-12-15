package com.flight.booking.config;

import java.util.Optional;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.core.context.SecurityContextHolder;

import com.flight.booking.model.User;

@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
public class JpaConfig {

	@Bean
	AuditorAware<String> auditorProvider() {
		return new AuditAwareImpl();
	}
}

class AuditAwareImpl implements AuditorAware<String> {

	@Override
	public Optional<String> getCurrentAuditor() {
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		return Optional.of(user.getUserName());
	}

}
