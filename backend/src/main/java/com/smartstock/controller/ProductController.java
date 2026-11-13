package com.smartstock.controller;

import com.smartstock.model.Product;
import com.smartstock.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Presentation layer - exposes the REST API the React frontend calls.
 *
 * @RestController = @Controller + @ResponseBody, so every method's return
 * value is written straight into the HTTP response body as JSON (Spring
 * Boot's auto-configured Jackson converter handles the Java-object-to-JSON
 * conversion automatically).
 * @RequestMapping("/api/products") is the shared base path for every
 * endpoint in this class.
 *
 * Exactly the three endpoints described in the report and architecture
 * diagram:
 *   GET  /api/products            -> list every product
 *   GET  /api/products/low-stock  -> list products at/under the threshold
 *   POST /api/products            -> add a new product
 */
@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/low-stock")
    public List<Product> getLowStockProducts() {
        return productService.getLowStockProducts();
    }

    @PostMapping
    public ResponseEntity<Product> addProduct(@RequestBody Product product) {
        Product saved = productService.addProduct(product);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }
}
