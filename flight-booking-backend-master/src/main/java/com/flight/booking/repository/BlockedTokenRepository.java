package com.flight.booking.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.flight.booking.repository.entity.BlockedTokenEntity;

public interface BlockedTokenRepository extends JpaRepository<BlockedTokenEntity, Integer> {

	Optional<BlockedTokenEntity> findByToken(String token);

}
