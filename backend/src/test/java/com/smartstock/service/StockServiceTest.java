package com.smartstock.service;

import com.smartstock.model.MovementType;
import com.smartstock.model.Product;
import com.smartstock.repository.ProductRepository;
import com.smartstock.repository.StockTransactionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StockServiceTest {

    @Mock
    private ProductRepository productRepository;
    @Mock
    private StockTransactionRepository transactionRepository;

    @InjectMocks
    private StockService service;

    private Product product() {
        Product p = new Product("Wireless Mouse", "Electronics", 10, 650.0);
        p.setProductId(1L);
        return p;
    }

    @Test
    void additionIncreasesQuantity() {
        Product p = product();
        when(productRepository.findById(1L)).thenReturn(Optional.of(p));

        var result = service.recordMovement(1L, MovementType.ADDITION, 5, "Restock");

        assertEquals(15, p.getQuantity());
        assertEquals(10, result.previousQuantity());
        assertEquals(15, result.newQuantity());
    }

    @Test
    void reductionBelowZeroIsRejected() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product()));

        assertThrows(IllegalArgumentException.class,
                () -> service.recordMovement(1L, MovementType.REDUCTION, 11, "Damaged"));
    }

    @Test
    void adjustmentSetsQuantity() {
        Product p = product();
        when(productRepository.findById(1L)).thenReturn(Optional.of(p));

        service.recordMovement(1L, MovementType.ADJUSTMENT, 3, "Stock count");

        assertEquals(3, p.getQuantity());
    }
}
