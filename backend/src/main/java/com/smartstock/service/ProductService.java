package com.smartstock.service;

import com.smartstock.model.Product;
import com.smartstock.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Business logic layer. The Controller never talks to the Repository
 * directly - every request passes through this Service first, which is
 * where validation rules and the low-stock threshold live, matching the
 * three-layer architecture (Controller -> Service -> Repository) described
 * in the project report and architecture diagram.
 *
 * @Service marks this as a Spring-managed bean so it can be injected
 * (@Autowired) into ProductController.
 */
@Service
public class ProductService {

    // Products at or below this quantity are considered "low stock".
    private static final int LOW_STOCK_THRESHOLD = 10;

    private final ProductRepository productRepository;

    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getLowStockProducts() {
        return productRepository.findByQuantityLessThanEqual(LOW_STOCK_THRESHOLD);
    }

    /**
     * Validates and saves a new product.
     * Business rules (as documented in the report):
     *  - product name must not be blank
     *  - quantity must not be negative
     *  - price must not be missing or negative
     * Any violation throws IllegalArgumentException, which
     * GlobalExceptionHandler turns into a 400 Bad Request response.
     */
    public Product addProduct(Product product) {
        if (product.getProductName() == null || product.getProductName().trim().isEmpty()) {
            throw new IllegalArgumentException("Product name is required.");
        }
        if (product.getQuantity() < 0) {
            throw new IllegalArgumentException("Quantity cannot be negative.");
        }
        if (product.getPrice() <= 0) {
            throw new IllegalArgumentException("Price must be greater than zero.");
        }
        return productRepository.save(product);
    }
}
