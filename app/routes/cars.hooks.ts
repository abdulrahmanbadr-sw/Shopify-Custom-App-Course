import { useState, useCallback } from "react";
import { useSearchParams } from "@remix-run/react";

export function useCarFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || ""
  );
  const [selectedBrand, setSelectedBrand] = useState(
    searchParams.get("brand") || ""
  );
  const [selectedLicensePlate, setSelectedLicensePlate] = useState(
    searchParams.get("licensePlate") || ""
  );
  const [selectedYear, setSelectedYear] = useState(
    searchParams.get("year") || ""
  );
  const [selectedDriverName, setSelectedDriverName] = useState(
    searchParams.get("driverName") || ""
  );
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>(
    searchParams.getAll("fuelType")
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set("search", value);
    } else {
      newParams.delete("search");
    }
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const handleBrandFilterChange = useCallback((value: string) => {
    setSelectedBrand(value);
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set("brand", value);
    } else {
      newParams.delete("brand");
    }
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const handleLicensePlateFilterChange = useCallback((value: string) => {
    setSelectedLicensePlate(value);
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set("licensePlate", value);
    } else {
      newParams.delete("licensePlate");
    }
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const handleYearFilterChange = useCallback((value: string) => {
    setSelectedYear(value);
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set("year", value);
    } else {
      newParams.delete("year");
    }
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const handleDriverNameFilterChange = useCallback((value: string) => {
    setSelectedDriverName(value);
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set("driverName", value);
    } else {
      newParams.delete("driverName");
    }
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const handleFuelTypeFilterChange = useCallback((value: string[]) => {
    setSelectedFuelTypes(value);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("fuelType");
    value.forEach((fuelType) => {
      newParams.append("fuelType", fuelType);
    });
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const handleRemoveFuelTypeFilter = useCallback((fuelTypeToRemove: string) => {
    const newSelected = selectedFuelTypes.filter((ft) => ft !== fuelTypeToRemove);
    setSelectedFuelTypes(newSelected);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("fuelType");
    newSelected.forEach((fuelType) => {
      newParams.append("fuelType", fuelType);
    });
    setSearchParams(newParams);
  }, [selectedFuelTypes, searchParams, setSearchParams]);

  const handleResetAllFilters = useCallback(() => {
    setSearchValue("");
    setSelectedBrand("");
    setSelectedLicensePlate("");
    setSelectedYear("");
    setSelectedDriverName("");
    setSelectedFuelTypes([]);
    const newParams = new URLSearchParams();
    setSearchParams(newParams);
  }, [setSearchParams]);

  return {
    searchValue,
    selectedBrand,
    selectedLicensePlate,
    selectedYear,
    selectedDriverName,
    selectedFuelTypes,
    handleSearchChange,
    handleBrandFilterChange,
    handleLicensePlateFilterChange,
    handleYearFilterChange,
    handleDriverNameFilterChange,
    handleFuelTypeFilterChange,
    handleRemoveFuelTypeFilter,
    handleResetAllFilters,
  };
}

