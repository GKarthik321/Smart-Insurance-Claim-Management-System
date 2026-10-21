package com.smartinsurance.claims.repository;

import com.smartinsurance.claims.entity.Product;
import com.smartinsurance.claims.entity.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByProductCategory(ProductCategory category);
    List<Product> findByActiveTrue();
}
