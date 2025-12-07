import { Form } from "@remix-run/react";
import {
  Modal,
  FormLayout,
  TextField,
  Select,
  Button,
  InlineStack,
  BlockStack,
  Text,
} from "@shopify/polaris";
import type { CarWithFuelType } from "./cars.types";

interface CarModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
}

interface CreateCarModalProps extends CarModalProps {
  brand: string;
  licensePlace: string;
  year: string;
  driverName: string;
  fuelTypeId: string;
  fuelTypeSelectOptions: Array<{ label: string; value: string }>;
  onBrandChange: (value: string) => void;
  onLicensePlaceChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onDriverNameChange: (value: string) => void;
  onFuelTypeIdChange: (value: string) => void;
}

interface EditCarModalProps extends CarModalProps {
  car: CarWithFuelType | null;
  brand: string;
  licensePlace: string;
  year: string;
  driverName: string;
  fuelTypeId: string;
  fuelTypeSelectOptions: Array<{ label: string; value: string }>;
  onBrandChange: (value: string) => void;
  onLicensePlaceChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onDriverNameChange: (value: string) => void;
  onFuelTypeIdChange: (value: string) => void;
}

interface DeleteCarModalProps extends CarModalProps {
  car: CarWithFuelType | null;
}

export function CreateCarModal({
  isOpen,
  onClose,
  isLoading,
  brand,
  licensePlace,
  year,
  driverName,
  fuelTypeId,
  fuelTypeSelectOptions,
  onBrandChange,
  onLicensePlaceChange,
  onYearChange,
  onDriverNameChange,
  onFuelTypeIdChange,
}: CreateCarModalProps) {
  return (
    <Modal open={isOpen} onClose={onClose} title="Add New Car" key="create-modal">
      <Modal.Section>
        <Form method="post">
          <FormLayout>
            <input type="hidden" name="intent" value="create" />
            <TextField
              label="Brand"
              name="brand"
              value={brand}
              onChange={onBrandChange}
              requiredIndicator
              autoComplete="off"
            />
            <TextField
              label="License Plate"
              name="licensePlace"
              value={licensePlace}
              onChange={onLicensePlaceChange}
              requiredIndicator
              autoComplete="off"
            />
            <TextField
              label="Year"
              name="year"
              type="number"
              value={year}
              onChange={onYearChange}
              requiredIndicator
              autoComplete="off"
            />
            <TextField
              label="Driver Name"
              name="driverName"
              value={driverName}
              onChange={onDriverNameChange}
              autoComplete="off"
            />
            <Select
              key="create-fuel-type-select"
              label="Fuel Type"
              name="fuelTypeId"
              options={fuelTypeSelectOptions}
              value={fuelTypeId}
              onChange={onFuelTypeIdChange}
              requiredIndicator
            />
            <InlineStack gap="200" align="end">
              <Button onClick={onClose}>Cancel</Button>
              <Button submit variant="primary" loading={isLoading}>
                Create Car
              </Button>
            </InlineStack>
          </FormLayout>
        </Form>
      </Modal.Section>
    </Modal>
  );
}

export function EditCarModal({
  isOpen,
  onClose,
  isLoading,
  car,
  brand,
  licensePlace,
  year,
  driverName,
  fuelTypeId,
  fuelTypeSelectOptions,
  onBrandChange,
  onLicensePlaceChange,
  onYearChange,
  onDriverNameChange,
  onFuelTypeIdChange,
}: EditCarModalProps) {
  return (
    <Modal open={isOpen} onClose={onClose} title="Edit Car" key="edit-modal">
      <Modal.Section>
        <Form method="post">
          <FormLayout>
            <input type="hidden" name="intent" value="update" />
            <input type="hidden" name="id" value={car?.id} />
            <TextField
              label="Brand"
              name="brand"
              value={brand}
              onChange={onBrandChange}
              requiredIndicator
              autoComplete="off"
            />
            <TextField
              label="License Plate"
              name="licensePlace"
              value={licensePlace}
              onChange={onLicensePlaceChange}
              requiredIndicator
              autoComplete="off"
            />
            <TextField
              label="Year"
              name="year"
              type="number"
              value={year}
              onChange={onYearChange}
              requiredIndicator
              autoComplete="off"
            />
            <TextField
              label="Driver Name"
              name="driverName"
              value={driverName}
              onChange={onDriverNameChange}
              autoComplete="off"
            />
            <Select
              key="edit-fuel-type-select"
              label="Fuel Type"
              name="fuelTypeId"
              options={fuelTypeSelectOptions}
              value={fuelTypeId}
              onChange={onFuelTypeIdChange}
              requiredIndicator
            />
            <InlineStack gap="200" align="end">
              <Button onClick={onClose}>Cancel</Button>
              <Button submit variant="primary" loading={isLoading}>
                Save Changes
              </Button>
            </InlineStack>
          </FormLayout>
        </Form>
      </Modal.Section>
    </Modal>
  );
}

export function DeleteCarModal({
  isOpen,
  onClose,
  isLoading,
  car,
}: DeleteCarModalProps) {
  return (
    <Modal open={isOpen} onClose={onClose} title="Delete Car">
      <Modal.Section>
        <BlockStack gap="200">
          <Text as="p">Are you sure you want to delete this car?</Text>
          {car && (
            <Text as="p" variant="bodyMd" fontWeight="semibold">
              {car.brand} - {car.licensePlace}
            </Text>
          )}
          <Text as="p" tone="subdued">
            This action cannot be undone.
          </Text>
          <Form method="post">
            <input type="hidden" name="intent" value="delete" />
            <input type="hidden" name="id" value={car?.id} />
            <InlineStack gap="200" align="end">
              <Button onClick={onClose}>Cancel</Button>
              <Button submit tone="critical" loading={isLoading}>
                Delete Car
              </Button>
            </InlineStack>
          </Form>
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
}

