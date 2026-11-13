package com.smartstock.repository;

import com.smartstock.model.StockTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface StockTransactionRepository extends JpaRepository<StockTransaction, Long> {

    List<StockTransaction> findAllByOrderByCreatedAtDescTransactionIdDesc();

    List<StockTransaction> findByCreatedAtGreaterThanEqual(LocalDateTime since);
}
