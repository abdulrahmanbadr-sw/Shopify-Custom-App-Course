import { useState, useCallback, useEffect } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigation, useSearchParams } from "@remix-run/react";
import {
  Page,
  Card,
  IndexTable,
  Text,
  BlockStack,
  InlineStack,
  Badge,
  Button,
  Banner,
  Toast,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { json, redirect } from "@remix-run/node";
import type { CarWithFuelType } from "./cars.types";
import { CarFilters } from "./cars.filters";
import { CreateCarModal, EditCarModal, DeleteCarModal } from "./cars.modals";
import { useCarFilters } from "./cars.hooks";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  const url = new URL(request.url);
  const search = url.searchParams.get("search") || "";
  const brandFilter = url.searchParams.get("brand") || "";
  const licensePlateFilter = url.searchParams.get("licensePlate") || "";
  const yearFilter = url.searchParams.get("year") || "";
  const driverNameFilter = url.searchParams.get("driverName") || "";
  const fuelTypeFilters = url.searchParams.getAll("fuelType"); // Support multiple values
  const sortKey = url.searchParams.get("sortKey") || "id";
  const sortDirection = url.searchParams.get("sortDirection") || "asc";

  // Build where clause for filtering
  const where: any = {};
  
  if (search) {
    where.OR = [
      { brand: { contains: search } },
      { licensePlace: { contains: search } },
      { driverName: { contains: search } },
    ];
  }

  if (brandFilter) {
    where.brand = brandFilter;
  }

  if (licensePlateFilter) {
    where.licensePlace = licensePlateFilter;
  }

  if (yearFilter) {
    where.year = parseInt(yearFilter);
  }

  if (driverNameFilter) {
    where.driverName = driverNameFilter;
  }

  if (fuelTypeFilters.length > 0) {
    where.fuelType = {
      name: { in: fuelTypeFilters },
    };
  }

  // Build orderBy clause
  let orderBy: any = {};
  if (sortKey === "fuelType") {
    orderBy = { fuelType: { name: sortDirection } };
  } else {
    orderBy = { [sortKey]: sortDirection };
  }

  const cars = await (prisma as any).car.findMany({
    where,
    include: {
      fuelType: true,
    },
    orderBy,
  });

  // Fetch all fuel types for dropdown
  const fuelTypes = await (prisma as any).carFuelType.findMany({
    orderBy: { name: 'asc' },
  });

  // Fetch unique values for each column for dropdown filters
  const allCars = await (prisma as any).car.findMany({
    include: {
      fuelType: true,
    },
  });

  const uniqueBrands = [...new Set(allCars.map((car: any) => car.brand as string))].sort() as string[];
  const uniqueLicensePlates = [...new Set(allCars.map((car: any) => car.licensePlace as string))].sort() as string[];
  const uniqueYears = [...new Set(allCars.map((car: any) => car.year.toString() as string))].sort((a, b) => parseInt(b as string) - parseInt(a as string)) as string[];
  const uniqueDriverNames = [...new Set(allCars.map((car: any) => car.driverName as string).filter((name: string) => name))].sort() as string[];

  return { 
    cars, 
    fuelTypes,
    uniqueBrands,
    uniqueLicensePlates,
    uniqueYears,
    uniqueDriverNames,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  await authenticate.admin(request);
  
  const formData = await request.formData();
  const intent = formData.get("intent");

  try {
    if (intent === "create") {
      const brand = formData.get("brand") as string;
      const licensePlace = formData.get("licensePlace") as string;
      const year = parseInt(formData.get("year") as string);
      const driverName = formData.get("driverName") as string || null;
      const fuelTypeId = parseInt(formData.get("fuelTypeId") as string);

      // Validate required fields
      if (!brand || !licensePlace || !year || !fuelTypeId) {
        return json({ error: "All fields except driver name are required" }, { status: 400 });
      }

      // Check if license plate already exists
      const existing = await (prisma as any).car.findUnique({
        where: { licensePlace },
      });

      if (existing) {
        return json({ error: "License plate already exists" }, { status: 400 });
      }

      await (prisma as any).car.create({
        data: {
          brand,
          licensePlace,
          year,
          driverName,
          fuelTypeId,
        },
      });

      return redirect("/app/cars");
    }

    if (intent === "update") {
      const id = parseInt(formData.get("id") as string);
      const brand = formData.get("brand") as string;
      const licensePlace = formData.get("licensePlace") as string;
      const year = parseInt(formData.get("year") as string);
      const driverName = formData.get("driverName") as string || null;
      const fuelTypeId = parseInt(formData.get("fuelTypeId") as string);

      // Validate required fields
      if (!brand || !licensePlace || !year || !fuelTypeId) {
        return json({ error: "All fields except driver name are required" }, { status: 400 });
      }

      // Check if license plate already exists (excluding current car)
      const existing = await (prisma as any).car.findFirst({
        where: {
          licensePlace,
          NOT: { id },
        },
      });

      if (existing) {
        return json({ error: "License plate already exists" }, { status: 400 });
      }

      await (prisma as any).car.update({
        where: { id },
        data: {
          brand,
          licensePlace,
          year,
          driverName,
          fuelTypeId,
        },
      });

      return redirect("/app/cars");
    }

    if (intent === "delete") {
      const id = parseInt(formData.get("id") as string);
      
      await (prisma as any).car.delete({
        where: { id },
      });

      return redirect("/app/cars");
    }

    return json({ error: "Invalid intent" }, { status: 400 });
  } catch (error: any) {
    return json({ error: error.message || "An error occurred" }, { status: 500 });
  }
};

export default function Cars() {
  const { cars, fuelTypes, uniqueBrands, uniqueLicensePlates, uniqueYears, uniqueDriverNames } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Use extracted filter hook
  const {
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
  } = useCarFilters();

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<CarWithFuelType | null>(null);
  const [toastActive, setToastActive] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Form states
  const [brand, setBrand] = useState("");
  const [licensePlace, setLicensePlace] = useState("");
  const [year, setYear] = useState("");
  const [driverName, setDriverName] = useState("");
  const [fuelTypeId, setFuelTypeId] = useState("");
  
  const [sortKey, setSortKey] = useState(
    searchParams.get("sortKey") || "id"
  );
  const [sortDirection, setSortDirection] = useState<"ascending" | "descending">(
    (searchParams.get("sortDirection") === "desc" ? "descending" : "ascending")
  );

  // Show toast on action error
  useEffect(() => {
    if (actionData?.error && !toastActive) {
      setToastActive(true);
      setToastMessage(actionData.error);
    }
  }, [actionData?.error, toastActive]);

  const isLoading = navigation.state === "submitting" || navigation.state === "loading";

  const handleSort = useCallback((headingIndex: number, direction: "ascending" | "descending") => {
    const columnKeys = ["id", "brand", "licensePlace", "year", "driverName", "fuelType"];
    const key = columnKeys[headingIndex];
    const newParams = new URLSearchParams(searchParams);
    
    setSortKey(key);
    setSortDirection(direction);
    newParams.set("sortKey", key);
    newParams.set("sortDirection", direction === "ascending" ? "asc" : "desc");
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  // Use actual fuel types from database for filter options
  const uniqueFuelTypes = fuelTypes.reduce((acc: any[], ft: any) => {
    if (!acc.find((item: any) => item.name === ft.name)) {
      acc.push(ft);
    }
    return acc;
  }, []);

  // Fuel type options for filter (using names from database)
  const fuelTypeFilterOptions = uniqueFuelTypes.map((ft: any) => ({
    label: ft.name,
    value: ft.name,
  }));

  // Fuel type options for select dropdowns in modals (using IDs)
  const fuelTypeSelectOptions = uniqueFuelTypes.map((ft: any) => ({
    label: ft.name,
    value: ft.id.toString(),
  }));

  const resourceName = {
    singular: "car",
    plural: "cars",
  };

  const handleCreateClick = useCallback(() => {
    setBrand("");
    setLicensePlace("");
    setYear("");
    setDriverName("");
    setFuelTypeId("");
    setCreateModalOpen(true);
  }, []);

  const handleEditClick = useCallback((car: CarWithFuelType) => {
    setSelectedCar(car);
    setBrand(car.brand);
    setLicensePlace(car.licensePlace);
    setYear(car.year.toString());
    setDriverName(car.driverName || "");
    setFuelTypeId(car.fuelType.id.toString());
    setEditModalOpen(true);
  }, []);

  const handleDeleteClick = useCallback((car: CarWithFuelType) => {
    setSelectedCar(car);
    setDeleteModalOpen(true);
  }, []);

  const rowMarkup = cars.map((car: CarWithFuelType, index: number) => (
    <IndexTable.Row id={car.id.toString()} key={car.id} position={index}>
      <IndexTable.Cell>
        <Text variant="bodyMd" fontWeight="bold" as="span">
          {car.id}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>{car.brand}</IndexTable.Cell>
      <IndexTable.Cell>{car.licensePlace}</IndexTable.Cell>
      <IndexTable.Cell>{car.year}</IndexTable.Cell>
      <IndexTable.Cell>{car.driverName || "-"}</IndexTable.Cell>
      <IndexTable.Cell>
        <Badge>{car.fuelType.name}</Badge>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <InlineStack gap="200">
          <Button size="micro" onClick={() => handleEditClick(car)}>
            Edit
          </Button>
          <Button size="micro" tone="critical" onClick={() => handleDeleteClick(car)}>
            Delete
          </Button>
        </InlineStack>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <Page>
      <TitleBar title="Cars" />
      {actionData?.error && (
        <Banner tone="critical" onDismiss={() => {}}>
          {actionData.error}
        </Banner>
      )}
      <BlockStack gap="500">
        <CarFilters
          searchValue={searchValue}
          selectedBrand={selectedBrand}
          selectedLicensePlate={selectedLicensePlate}
          selectedYear={selectedYear}
          selectedDriverName={selectedDriverName}
          selectedFuelTypes={selectedFuelTypes}
          uniqueBrands={uniqueBrands}
          uniqueLicensePlates={uniqueLicensePlates}
          uniqueYears={uniqueYears}
          uniqueDriverNames={uniqueDriverNames}
          fuelTypeFilterOptions={fuelTypeFilterOptions}
          onSearchChange={handleSearchChange}
          onBrandChange={handleBrandFilterChange}
          onLicensePlateChange={handleLicensePlateFilterChange}
          onYearChange={handleYearFilterChange}
          onDriverNameChange={handleDriverNameFilterChange}
          onFuelTypeChange={handleFuelTypeFilterChange}
          onRemoveFuelType={handleRemoveFuelTypeFilter}
          onResetAll={handleResetAllFilters}
          onAddCarClick={handleCreateClick}
        />

        <Card>
          <IndexTable
            resourceName={resourceName}
            itemCount={cars.length}
            headings={[
              { title: "ID" },
              { title: "Brand" },
              { title: "License Plate" },
              { title: "Year" },
              { title: "Driver Name" },
              { title: "Fuel Type" },
              { title: "Actions" },
            ]}
            sortable={[true, true, true, true, true, true, false]}
            sortColumnIndex={getSortColumnIndex(sortKey)}
            sortDirection={sortDirection}
            onSort={handleSort}
            emptyState={
              <Text variant="bodyMd" as="p">
                No cars found. Try adjusting your search or filters.
              </Text>
            }
          >
            {rowMarkup}
          </IndexTable>
        </Card>
      </BlockStack>

      <CreateCarModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        isLoading={isLoading}
        brand={brand}
        licensePlace={licensePlace}
        year={year}
        driverName={driverName}
        fuelTypeId={fuelTypeId}
        fuelTypeSelectOptions={fuelTypeSelectOptions}
        onBrandChange={setBrand}
        onLicensePlaceChange={setLicensePlace}
        onYearChange={setYear}
        onDriverNameChange={setDriverName}
        onFuelTypeIdChange={setFuelTypeId}
      />

      <EditCarModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        isLoading={isLoading}
        car={selectedCar}
        brand={brand}
        licensePlace={licensePlace}
        year={year}
        driverName={driverName}
        fuelTypeId={fuelTypeId}
        fuelTypeSelectOptions={fuelTypeSelectOptions}
        onBrandChange={setBrand}
        onLicensePlaceChange={setLicensePlace}
        onYearChange={setYear}
        onDriverNameChange={setDriverName}
        onFuelTypeIdChange={setFuelTypeId}
      />

      <DeleteCarModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        isLoading={isLoading}
        car={selectedCar}
      />

      {toastActive && (
        <Toast
          content={toastMessage}
          onDismiss={() => setToastActive(false)}
          error
        />
      )}
    </Page>
  );
}

function getSortColumnIndex(sortKey: string): number {
  const columnKeys = ["id", "brand", "licensePlace", "year", "driverName", "fuelType"];
  return columnKeys.indexOf(sortKey);
}

