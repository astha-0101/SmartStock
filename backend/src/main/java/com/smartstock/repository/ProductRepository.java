package com.smartstock.repository;

import com.smartstock.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Data access layer. Extending JpaRepository<Product, Long> gives this
 * interface findAll(), save(), findById(), deleteById(), count(), etc. for
 * free - Spring Data JPA generates the implementation at startup, so no SQL
 * or implementation class has to be written by hand.
 *
 * findByQuantityLessThanEqual(int quantity) is a derived query method:
 * Spring Data JPA parses the method name itself ("find by quantity, less
 * than or equal to") and builds the correct SQL
 * ("SELECT * FROM product WHERE quantity <= ?") automatically, purely from
 * the method signature.
 */
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByQuantityLessThanEqual(int quantity);
}
