export type CarWithFuelType = {
  id: number;
  brand: string;
  licensePlace: string;
  year: number;
  driverName: string | null;
  fuelType: {
    id: number;
    name: string;
  };
};

