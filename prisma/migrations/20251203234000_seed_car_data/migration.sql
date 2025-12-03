-- Seed CarFuelType data
INSERT INTO "CarFuelType" ("name") VALUES
  ('Gasoline'),
  ('Diesel'),
  ('Electric'),
  ('Hybrid'),
  ('Plug-in Hybrid');

-- Seed Car data
-- Note: fuelTypeId references the CarFuelType records above (1-5)
INSERT INTO "Car" ("brand", "licensePlace", "year", "fuelTypeId", "driverName") VALUES
  ('Toyota', 'ABC-1234', 2020, 1, 'John Smith'),
  ('Honda', 'XYZ-5678', 2021, 1, 'Jane Doe'),
  ('Tesla', 'ELC-9012', 2023, 3, 'Bob Johnson'),
  ('BMW', 'BMW-3456', 2022, 2, 'Alice Williams'),
  ('Ford', 'FRD-7890', 2021, 4, 'Charlie Brown'),
  ('Mercedes', 'MBZ-2468', 2023, 2, 'Diana Prince'),
  ('Nissan', 'NSN-1357', 2020, 1, 'Edward Norton'),
  ('Audi', 'AUD-9753', 2022, 5, 'Fiona Green'),
  ('Volkswagen', 'VW-8642', 2021, 2, 'George Martin'),
  ('Hyundai', 'HYN-7410', 2023, 4, 'Helen Troy');

