package com.smartstock.repository;

import com.smartstock.model.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {

    List<PurchaseOrder> findAllByOrderByOrderIdDesc();

    boolean existsBySupplierSupplierId(Long supplierId);
}
