-- Invariantes comerciales que PostgreSQL debe hacer cumplir.
ALTER TABLE "Product" ADD CONSTRAINT "Product_package_positive"
  CHECK ("weightGrams" > 0 AND "widthCm" > 0 AND "heightCm" > 0 AND "depthCm" > 0);
ALTER TABLE "Variant" ADD CONSTRAINT "Variant_price_nonnegative" CHECK ("priceCents" >= 0);
ALTER TABLE "Variant" ADD CONSTRAINT "Variant_inventory_valid"
  CHECK ("stock" >= 0 AND "reserved" >= 0 AND "reserved" <= "stock" AND "supplierAvailable" >= 0 AND "leadDays" >= 0);
ALTER TABLE "Order" ADD CONSTRAINT "Order_totals_valid"
  CHECK ("subtotalCents" >= 0 AND "shippingCents" >= 0 AND "totalCents" = "subtotalCents" + "shippingCents");
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_quantity_positive" CHECK ("quantity" > 0);
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_price_nonnegative" CHECK ("unitPriceCents" >= 0);
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_amount_nonnegative" CHECK ("amountCents" >= 0);
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_quantity_nonzero" CHECK ("quantity" <> 0);
