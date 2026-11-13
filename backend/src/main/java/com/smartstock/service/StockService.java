package com.smartstock.service;

import com.smartstock.dto.StockMovementResponse;
import com.smartstock.exception.ResourceNotFoundException;
import com.smartstock.model.MovementType;
import com.smartstock.model.Product;
import com.smartstock.model.StockTransaction;
import com.smartstock.repository.ProductRepository;
import com.smartstock.repository.StockTransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Single place where product quantities change. Every change also writes a
 * stock_transaction row, in the same database transaction.
 */
@Service
public class StockService {

    private final ProductRepository productRepository;
    private final StockTransactionRepository transactionRepository;

    public StockService(ProductRepository productRepository, StockTransactionRepository transactionRepository) {
        this.productRepository = productRepository;
        this.transactionRepository = transactionRepository;
    }

    /**
     * ADDITION: adds quantity. REDUCTION: subtracts quantity (never below zero).
     * ADJUSTMENT: sets the stock level to the given quantity.
     */
    @Transactional
    public StockMovementResponse recordMovement(Long productId, MovementType type, int quantity, String reason) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productId));

        int previous = product.getQuantity();
        int updated;
        if (type == MovementType.ADJUSTMENT) {
            if (quantity < 0) {
                throw new IllegalArgumentException("Adjusted quantity cannot be negative.");
            }
            updated = quantity;
        } else {
            if (quantity <= 0) {
                throw new IllegalArgumentException("Quantity must be greater than zero.");
            }
            if (type == MovementType.ADDITION) {
                updated = previous + quantity;
            } else {
                if (quantity > previous) {
                    throw new IllegalArgumentException(
                            "Cannot reduce by " + quantity + ": only " + previous + " in stock.");
                }
                updated = previous - quantity;
            }
        }

        product.setQuantity(updated);
        productRepository.save(product);

        StockTransaction transaction = new StockTransaction();
        transaction.setProduct(product);
        transaction.setType(type);
        transaction.setQuantity(quantity);
        transaction.setPreviousQuantity(previous);
        transaction.setNewQuantity(updated);
        transaction.setReason(reason);
        transaction.setCreatedAt(LocalDateTime.now());
        transactionRepository.save(transaction);

        return StockMovementResponse.from(transaction);
    }

    @Transactional(readOnly = true)
    public List<StockMovementResponse> getHistory() {
        return transactionRepository.findAllByOrderByCreatedAtDescTransactionIdDesc().stream()
                .map(StockMovementResponse::from)
                .toList();
    }
}
