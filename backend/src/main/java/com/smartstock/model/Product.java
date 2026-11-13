package com.smartstock.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;

/**
 * Product entity - maps directly to the "product" table in the database.
 *
 * @Entity tells Hibernate this class represents a database table.
 * @Table names that table explicitly as "product".
 * @Id + @GeneratedValue(strategy = IDENTITY) means the productId column is
 * the primary key and MySQL/H2 auto-increments it on every insert, so the
 * backend never has to generate IDs itself.
 *
 * Matches the Product entity described in the SmartStock Spring Boot
 * report: productId, productName, category, quantity, price.
 */
@Entity
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;

    @NotBlank(message = "Product name is required")
    private String productName;

    private String category;

    private int quantity;

    private double price;

    // JPA requires a no-argument constructor so Hibernate can build objects
    // when reading rows back from the database.
    public Product() {
    }

    public Product(String productName, String category, int quantity, double price) {
        this.productName = productName;
        this.category = category;
        this.quantity = quantity;
        this.price = price;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}
