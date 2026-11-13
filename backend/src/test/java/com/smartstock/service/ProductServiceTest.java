package com.smartstock.service;

import com.smartstock.model.Product;
import com.smartstock.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * JUnit 5 + Mockito unit tests for ProductService, matching the manual test
 * cases documented in the SmartStock Spring Boot report. The real
 * ProductRepository is replaced with a Mockito mock (@Mock) so these tests
 * check only the Service's business logic, without needing a real database.
 */
@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    private Product validProduct;

    @BeforeEach
    void setUp() {
        validProduct = new Product("Wireless Mouse", "Electronics", 85, 650.00);
    }

    @Test
    void addProduct_savesValidProduct() {
        when(productRepository.save(any(Product.class))).thenReturn(validProduct);

        Product saved = productService.addProduct(validProduct);

        assertEquals("Wireless Mouse", saved.getProductName());
        verify(productRepository, times(1)).save(validProduct);
    }

    @Test
    void addProduct_rejectsBlankName() {
        Product invalid = new Product("   ", "Electronics", 10, 100.0);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> productService.addProduct(invalid));

        assertEquals("Product name is required.", ex.getMessage());
        verify(productRepository, never()).save(any());
    }

    @Test
    void addProduct_rejectsNegativeQuantity() {
        Product invalid = new Product("Keyboard", "Electronics", -5, 100.0);

        assertThrows(IllegalArgumentException.class, () -> productService.addProduct(invalid));
        verify(productRepository, never()).save(any());
    }

    @Test
    void addProduct_rejectsZeroOrNegativePrice() {
        Product invalid = new Product("Keyboard", "Electronics", 10, 0.0);

        assertThrows(IllegalArgumentException.class, () -> productService.addProduct(invalid));
        verify(productRepository, never()).save(any());
    }

    @Test
    void getLowStockProducts_returnsOnlyLowStockItems() {
        Product lowStockItem = new Product("USB-C Hub", "Electronics", 8, 1750.0);
        when(productRepository.findByQuantityLessThanEqual(10)).thenReturn(List.of(lowStockItem));

        List<Product> result = productService.getLowStockProducts();

        assertEquals(1, result.size());
        assertEquals("USB-C Hub", result.get(0).getProductName());
    }
}
