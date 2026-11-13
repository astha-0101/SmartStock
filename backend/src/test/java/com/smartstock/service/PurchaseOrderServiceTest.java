package com.smartstock.service;

import com.smartstock.exception.ConflictException;
import com.smartstock.model.*;
import com.smartstock.repository.ProductRepository;
import com.smartstock.repository.PurchaseOrderRepository;
import com.smartstock.repository.SupplierRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PurchaseOrderServiceTest {

    @Mock
    private PurchaseOrderRepository orderRepository;
    @Mock
    private SupplierRepository supplierRepository;
    @Mock
    private ProductRepository productRepository;
    @Mock
    private StockService stockService;

    @InjectMocks
    private PurchaseOrderService service;

    private PurchaseOrder orderWith(PurchaseStatus status) {
        Supplier supplier = new Supplier();
        supplier.setSupplierId(1L);
        supplier.setName("TechZone");

        Product product = new Product("Wireless Mouse", "Electronics", 5, 650.0);
        product.setProductId(5L);

        PurchaseOrder order = new PurchaseOrder();
        order.setOrderId(1L);
        order.setSupplier(supplier);
        order.setOrderDate(LocalDate.now());
        order.setStatus(status);

        PurchaseOrderItem item = new PurchaseOrderItem();
        item.setOrder(order);
        item.setProduct(product);
        item.setQuantity(20);
        order.getItems().add(item);
        return order;
    }

    @Test
    void receivingApprovedOrderAddsStock() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(orderWith(PurchaseStatus.APPROVED)));

        var response = service.updateStatus(1L, PurchaseStatus.RECEIVED);

        assertEquals(PurchaseStatus.RECEIVED, response.status());
        verify(stockService).recordMovement(eq(5L), eq(MovementType.ADDITION), eq(20), anyString());
    }

    @Test
    void pendingOrderCannotBeReceivedDirectly() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(orderWith(PurchaseStatus.PENDING)));

        assertThrows(ConflictException.class, () -> service.updateStatus(1L, PurchaseStatus.RECEIVED));
        verify(stockService, never()).recordMovement(any(), any(), anyInt(), any());
    }
}
