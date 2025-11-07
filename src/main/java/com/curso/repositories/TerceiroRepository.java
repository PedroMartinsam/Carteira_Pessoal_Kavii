package com.curso.repositories;

import com.curso.domains.Terceiro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TerceiroRepository extends JpaRepository<Terceiro, Long> {
}
