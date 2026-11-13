-- Sample data loaded automatically on startup when the H2 profile is active
-- (spring.sql.init.mode=always), so the API has real rows to return right
-- away without manually calling POST /api/products first.

INSERT INTO product (product_name, category, quantity, price) VALUES ('Wireless Mouse', 'Electronics', 85, 650.00);
INSERT INTO product (product_name, category, quantity, price) VALUES ('Mechanical Keyboard', 'Electronics', 42, 2200.00);
INSERT INTO product (product_name, category, quantity, price) VALUES ('USB-C Hub 7-in-1', 'Electronics', 8, 1750.00);
INSERT INTO product (product_name, category, quantity, price) VALUES ('HDMI Cable 2m', 'Electronics', 120, 450.00);
INSERT INTO product (product_name, category, quantity, price) VALUES ('Desk Organizer', 'Stationery', 6, 450.00);
INSERT INTO product (product_name, category, quantity, price) VALUES ('Sticky Notes Pack', 'Stationery', 150, 90.00);
INSERT INTO product (product_name, category, quantity, price) VALUES ('Ergonomic Chair', 'Furniture', 3, 12500.00);
INSERT INTO product (product_name, category, quantity, price) VALUES ('Monitor Stand', 'Furniture', 9, 1800.00);
