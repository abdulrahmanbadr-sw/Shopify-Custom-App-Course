import { TextField, Select, InlineStack, Badge, Button, BlockStack, Card } from "@shopify/polaris";

interface CarFiltersProps {
  searchValue: string;
  selectedBrand: string;
  selectedLicensePlate: string;
  selectedYear: string;
  selectedDriverName: string;
  selectedFuelTypes: string[];
  uniqueBrands: string[];
  uniqueLicensePlates: string[];
  uniqueYears: string[];
  uniqueDriverNames: string[];
  fuelTypeFilterOptions: Array<{ label: string; value: string }>;
  onSearchChange: (value: string) => void;
  onBrandChange: (value: string) => void;
  onLicensePlateChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onDriverNameChange: (value: string) => void;
  onFuelTypeChange: (value: string[]) => void;
  onRemoveFuelType: (fuelType: string) => void;
  onResetAll: () => void;
  onAddCarClick: () => void;
}

export function CarFilters({
  searchValue,
  selectedBrand,
  selectedLicensePlate,
  selectedYear,
  selectedDriverName,
  selectedFuelTypes,
  uniqueBrands,
  uniqueLicensePlates,
  uniqueYears,
  uniqueDriverNames,
  fuelTypeFilterOptions,
  onSearchChange,
  onBrandChange,
  onLicensePlateChange,
  onYearChange,
  onDriverNameChange,
  onFuelTypeChange,
  onRemoveFuelType,
  onResetAll,
  onAddCarClick,
}: CarFiltersProps) {
  const hasActiveFilters = searchValue || selectedBrand || selectedLicensePlate || 
    selectedYear || selectedDriverName || selectedFuelTypes.length > 0;

  return (
    <Card>
      <BlockStack gap="400">
        {/* Search Bar and Add Car Button Row */}
        <InlineStack gap="400" align="space-between" blockAlign="center">
          <div style={{ flex: 1, maxWidth: "400px" }}>
            <TextField
              label="Search cars"
              labelHidden
              type="search"
              placeholder="Search by brand, license plate, or driver name"
              value={searchValue}
              onChange={onSearchChange}
              autoComplete="off"
            />
          </div>
          <Button variant="primary" onClick={onAddCarClick}>
            Add Car
          </Button>
        </InlineStack>
        
        {/* Column Filters Row */}
        <InlineStack gap="200" wrap>
          <div style={{ minWidth: "150px" }}>
            <Select
              label="Brand"
              labelHidden
              options={[
                { label: "All Brands", value: "" },
                ...uniqueBrands.map((brand) => ({ label: brand, value: brand }))
              ]}
              value={selectedBrand}
              onChange={onBrandChange}
            />
          </div>
          <div style={{ minWidth: "150px" }}>
            <Select
              label="License Plate"
              labelHidden
              options={[
                { label: "All License Plates", value: "" },
                ...uniqueLicensePlates.map((plate) => ({ label: plate, value: plate }))
              ]}
              value={selectedLicensePlate}
              onChange={onLicensePlateChange}
            />
          </div>
          <div style={{ minWidth: "150px" }}>
            <Select
              label="Year"
              labelHidden
              options={[
                { label: "All Years", value: "" },
                ...uniqueYears.map((year) => ({ label: year, value: year }))
              ]}
              value={selectedYear}
              onChange={onYearChange}
            />
          </div>
          <div style={{ minWidth: "150px" }}>
            <Select
              label="Driver Name"
              labelHidden
              options={[
                { label: "All Drivers", value: "" },
                ...uniqueDriverNames.map((name) => ({ label: name, value: name }))
              ]}
              value={selectedDriverName}
              onChange={onDriverNameChange}
            />
          </div>
          <div style={{ minWidth: "150px" }}>
            <Select
              label="Fuel Type"
              labelHidden
              options={[
                { label: "All Fuel Types", value: "" },
                ...fuelTypeFilterOptions
              ]}
              value={selectedFuelTypes.length > 0 ? selectedFuelTypes[0] : ""}
              onChange={(value) => {
                if (value) {
                  onFuelTypeChange([value]);
                } else {
                  onFuelTypeChange([]);
                }
              }}
            />
          </div>
        </InlineStack>
        
        {/* Active Filters Bar */}
        {hasActiveFilters && (
          <BlockStack gap="200">
            <InlineStack gap="200" align="space-between" blockAlign="center">
              <span style={{ fontWeight: 600 }}>Active Filters:</span>
              <Button onClick={onResetAll}>Reset All Filters</Button>
            </InlineStack>
            <InlineStack gap="200" wrap>
              {searchValue && (
                <InlineStack gap="050" blockAlign="center">
                  <Badge tone="info">{`Search: ${searchValue}`}</Badge>
                  <Button size="micro" variant="plain" onClick={() => onSearchChange("")}>
                    ×
                  </Button>
                </InlineStack>
              )}
              {selectedBrand && (
                <InlineStack gap="050" blockAlign="center">
                  <Badge tone="info">{`Brand: ${selectedBrand}`}</Badge>
                  <Button size="micro" variant="plain" onClick={() => onBrandChange("")}>
                    ×
                  </Button>
                </InlineStack>
              )}
              {selectedLicensePlate && (
                <InlineStack gap="050" blockAlign="center">
                  <Badge tone="info">{`License Plate: ${selectedLicensePlate}`}</Badge>
                  <Button size="micro" variant="plain" onClick={() => onLicensePlateChange("")}>
                    ×
                  </Button>
                </InlineStack>
              )}
              {selectedYear && (
                <InlineStack gap="050" blockAlign="center">
                  <Badge tone="info">{`Year: ${selectedYear}`}</Badge>
                  <Button size="micro" variant="plain" onClick={() => onYearChange("")}>
                    ×
                  </Button>
                </InlineStack>
              )}
              {selectedDriverName && (
                <InlineStack gap="050" blockAlign="center">
                  <Badge tone="info">{`Driver: ${selectedDriverName}`}</Badge>
                  <Button size="micro" variant="plain" onClick={() => onDriverNameChange("")}>
                    ×
                  </Button>
                </InlineStack>
              )}
              {selectedFuelTypes.map((fuelType) => (
                <InlineStack key={fuelType} gap="050" blockAlign="center">
                  <Badge tone="info">{`Fuel Type: ${fuelType}`}</Badge>
                  <Button size="micro" variant="plain" onClick={() => onRemoveFuelType(fuelType)}>
                    ×
                  </Button>
                </InlineStack>
              ))}
            </InlineStack>
          </BlockStack>
        )}
      </BlockStack>
    </Card>
  );
}

