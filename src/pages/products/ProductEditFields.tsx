import Container from "@/components/Container";
import PrimaryButton from "@/components/PrimaryButton";
import InputField from "@/components/customFields/input/InputField";
import TextAreaField from "@/components/customFields/input/TextAreaField";
import { HandlerProps } from "@/components/customFields/type";
import DashboardLayout from "@/components/dashboard/Layout";
import { FC } from "react";
import { TitleHeader } from "./TitleHeader";
import { useGeneralQuery } from "@/hooks/request/useGeneralQuery";
import { GetManyProps } from "@/hooks/types";
import { ProductCategoryProps } from "@/interfaces/productCategories";
import { ProductUnitProps } from "@/interfaces/productUnits";
import { ProductBrandProps } from "@/interfaces/productBrands";
import { ProductCodeProps } from "@/interfaces/productCode";
import { SupplierProps } from "@/interfaces/supplier";
import SelectField from "@/components/customFields/Select/SelectField";
import NumberField from "@/components/customFields/input/NumberField";
import RadioBoxFieldGroup from "@/components/customFields/combo/RadioBoxFieldGroup";
import CustomField from "@/components/customFields/input/CustomInput";
import { DollarSign } from "lucide-react";
import CheckBoxField from "@/components/customFields/combo/CheckBoxField";
import DatePicker from "@/components/customFields/date/DatePicker";
import { barCodeOptions, productStatusOptions } from "@/defaults";
import DimensionField from "@/components/customFields/dimension/DimensionField";
import FileDropzone, { UploadedFileProps } from "@/components/FileDropzone";

interface EditProductFieldsProps {
  buttonTitle: string;
  formFields: Record<string, any>;
  onsubmitHandler: () => void;
  handleFormFieldChange: (data: HandlerProps) => void;
  errors: Record<string, any>;
  isLoading?: boolean;
  pageTitle: string;
  disabledButton?: boolean;
  formTitle: string;
  pageDescription: string;
  handleImageUpload: ({ fileURL, uploadedFile }: UploadedFileProps) => void;
}
const ProductEditFields: FC<EditProductFieldsProps> = ({
  handleFormFieldChange,
  onsubmitHandler,
  formFields,
  errors,
  isLoading,
  buttonTitle,
  pageTitle,
  disabledButton,
  formTitle,
  pageDescription,
  handleImageUpload
}) => {
  const { data: categoryData } = useGeneralQuery<GetManyProps<ProductCategoryProps[]>>({
    queryKey: ["productCategories", {}],
    url: "/product-categories",
    query: { deleted: false, columns: "name" },
    requireAuth: true,
     enabled: true
  });
  const { data: unitData } = useGeneralQuery<GetManyProps<ProductUnitProps[]>>({
    queryKey: ["productUnits", {}],
    url: "/product-units",
    query: { deleted: false, columns: "name,title" },
    requireAuth: true,
     enabled: true
  });
  const { data: brandData } = useGeneralQuery<GetManyProps<ProductBrandProps[]>>({
    queryKey: ["productBrands", {}],
    url: "/product-brands",
    query: { deleted: false, columns: "name" },
    requireAuth: true,
     enabled: true
  });
  const { data: codeData } = useGeneralQuery<GetManyProps<ProductCodeProps[]>>({
    queryKey: ["productCodes", {}],
    url: "/product-codes",
    query: { deleted: false, columns: "code" },
    requireAuth: true,
     enabled: true
  });
  const { data: supplierData } = useGeneralQuery<GetManyProps<SupplierProps[]>>({
    queryKey: ["suppliers", {}],
    url: "/suppliers",
    query: { deleted: false, columns: "name" },
    requireAuth: true,
    enabled: true
  });
  const categoriesOptions =
    categoryData?.data.map((category) => {
      return {
        label: category.name,
        value: category._id
      };
    }) || [];
  const unitOptions =
    unitData?.data.map((unit) => {
      return {
        label: `${unit.title} (${unit.name})`,
        value: unit._id
      };
    }) || [];
  const brandOptions =
    brandData?.data.map((brand) => {
      return {
        label: `${brand.name}`,
        value: brand._id
      };
    }) || [];
  const codeOptions =
    codeData?.data.map((code) => {
      return {
        label: `${code.code}`,
        value: code._id
      };
    }) || [];
  const supplierOptions =
    supplierData?.data.map((supplier) => {
      return {
        label: `${supplier.name}`,
        value: supplier._id
      };
    }) || [];

  return (
    <DashboardLayout pageTitle={pageTitle} pageDescription={pageDescription} isLoading={isLoading}>
      <Container className="border border-gray-50">
        <h1>{formTitle}</h1>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="left-content">
            {/* Description */}
            <div className="description mb-3">
              <TitleHeader text="Description" />
              <div className="border border-gray-100 rounded-sm p-4 space-y-3">
                <InputField
                  handleInputChange={handleFormFieldChange}
                  fieldKey="name"
                  label="Product Name"
                  value={formFields?.name}
                  isRequired
                  errorMessage={errors?.name}
                  disabled={isLoading}
                />
                <TextAreaField
                  handleInputChange={handleFormFieldChange}
                  fieldKey="description"
                  label="Product Description"
                  value={formFields?.description}
                  isRequired
                  errorMessage={errors?.description}
                  disabled={isLoading}
                />
              </div>
            </div>
            {/* Product Code */}
            <div className="product-code mb-3">
              <TitleHeader text="Product Code" />
              <div className="border border-gray-100 rounded-sm p-4 space-y-3">
                <SelectField
                  fieldKey="productCodeId"
                  label="Product Code"
                  selectValue={formFields?.productCodeId}
                  onChange={handleFormFieldChange}
                  isRequired
                  options={codeOptions}
                  closeOnSelect
                  errorMessage={errors?.productCodeId}
                  isDisabled={isLoading}
                />
              </div>
            </div>
            {/* Category */}
            <div className="category mb-3">
              <TitleHeader text="Category" />
              <div className="border border-gray-100 rounded-sm p-4 space-y-3">
                <SelectField
                  fieldKey="categoryId"
                  label="Product Category"
                  selectValue={formFields?.categoryId}
                  onChange={handleFormFieldChange}
                  isRequired
                  options={categoriesOptions}
                  closeOnSelect
                  errorMessage={errors?.categoryId}
                  isDisabled={isLoading}
                />
                <SelectField
                  fieldKey="supplierId"
                  label="Product Supplier"
                  selectValue={formFields?.supplierId}
                  onChange={handleFormFieldChange}
                  isRequired
                  options={supplierOptions}
                  closeOnSelect
                  errorMessage={errors?.supplierId}
                  isDisabled={isLoading}
                />
                <SelectField
                  fieldKey="brandId"
                  label="Product Brand"
                  selectValue={formFields?.brandId}
                  onChange={handleFormFieldChange}
                  isRequired
                  options={brandOptions}
                  closeOnSelect
                  errorMessage={errors?.brandId}
                  isDisabled={isLoading}
                />
                <SelectField
                  fieldKey="unitId"
                  label="Product Unit"
                  selectValue={formFields?.unitId}
                  onChange={handleFormFieldChange}
                  isRequired
                  options={unitOptions}
                  closeOnSelect
                  errorMessage={errors?.unitId}
                  isDisabled={isLoading}
                />
              </div>
            </div>

            {/* Inventory */}
            <div className="inventory mb-3">
              <TitleHeader text="Inventory" />
              <div className="border border-gray-100 rounded-sm p-4 space-y-3">
                <NumberField
                  handleInputChange={handleFormFieldChange}
                  fieldKey="alertQuantity"
                  label="Alert Quantity"
                  value={formFields?.alertQuantity}
                  min={0}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Selling Type */}
            <div className="selling-type mb-3">
              <TitleHeader text="Selling Type" />
              <div className="border border-gray-100 rounded-sm p-4 space-y-3">
                <RadioBoxFieldGroup
                  fieldKey="availability"
                  handleFieldChange={handleFormFieldChange}
                  options={[
                    { label: "Available online only", value: "onlineOnly" },
                    { label: "Available offline only", value: "offlineOnly" },
                    { label: "Available both online and offline", value: "bothOnlineAndOffLine" }
                  ]}
                  value={formFields?.availability}
                  errorMessage={errors?.availability}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* VARIANT */}
            {/* <div className="variant mb-3">
              <TitleHeader text="Variant" />
              <button className="mt-2 border border-gray-100 rounded-sm p-2">+ Add Variant</button>
            </div> */}
          </div>

          <div className="right-content">
            {/* Product Images */}
            <div className="photo mb-3">
              <TitleHeader text="Product Images" />
              <div className="">
                <FileDropzone
                  onChange={handleImageUpload}
                  showPreview
                  maxFileSize={5}
                  allowedFileExtensions={["jpg", "jpeg", "png"]}
                />
              </div>
            </div>
            {/* Pricing */}
            <div className="pricing mb-3">
              <TitleHeader text="Pricing" />
              <div className="border border-gray-100 rounded-sm p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <CustomField
                    fieldKey="productUnitPrice"
                    handleInputChange={handleFormFieldChange}
                    label="Unit Price"
                    icon={{
                      element: DollarSign,
                      position: "left",
                      show: true
                    }}
                    type="number"
                    value={formFields?.productUnitPrice}
                    isRequired
                    errorMessage={errors?.productUnitPrice}
                    disabled={isLoading}
                  />
                  <CustomField
                    fieldKey="productSellingPrice"
                    handleInputChange={handleFormFieldChange}
                    label="Selling Price"
                    type="number"
                    icon={{
                      element: DollarSign,
                      position: "left",
                      show: true
                    }}
                    value={formFields?.productSellingPrice}
                    isRequired
                    errorMessage={errors?.productSellingPrice}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
            {/* Shipping and Delivery */}
            <div className="shipping mb-3">
              <TitleHeader text="Dimensions" />
              <div className="border border-gray-100 rounded-sm p-4 space-y-3">
                <NumberField
                  fieldKey="weight"
                  handleInputChange={handleFormFieldChange}
                  label="Items Weight (kg)"
                  min={0}
                  isRequired
                  errorMessage={errors?.weight}
                  value={formFields?.weight}
                  disabled={isLoading}
                />
                <DimensionField
                  fieldKey="dimensions"
                  onChange={handleFormFieldChange}
                  values={formFields?.dimensions}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Additional Fields */}
            <div className="additional mb-3">
              <TitleHeader text="Additional Information" />
              <div className="border border-gray-100 rounded-sm p-4 space-y-3">
                <CheckBoxField
                  handleFieldChange={handleFormFieldChange}
                  name="canExpire"
                  label="Can Expire"
                  fieldKey="canExpire"
                  value={formFields?.canExpire}
                  checked={formFields?.canExpire}
                  disabled={isLoading}
                />
                {formFields?.canExpire && (
                  <DatePicker
                    onChange={handleFormFieldChange}
                    fieldKey="expirationDate"
                    label="Expiration Date"
                    value={formFields?.expirationDate}
                    disabled={isLoading}
                  />
                )}
                <SelectField
                  onChange={handleFormFieldChange}
                  fieldKey="barcodeSymbology"
                  label="Barcode Symbology"
                  selectValue={formFields?.barcodeSymbology}
                  options={barCodeOptions}
                  closeOnSelect
                  isSearchable
                  isDisabled={isLoading}
                />
                <SelectField
                  onChange={handleFormFieldChange}
                  fieldKey="status"
                  label="Status"
                  selectValue={formFields?.status}
                  options={productStatusOptions}
                  closeOnSelect
                  isSearchable
                  isRequired
                  errorMessage={errors?.status}
                  isDisabled={isLoading}
                />
              </div>
            </div>

            <div className="mt-4">
              <PrimaryButton
                text={buttonTitle}
                disabled={disabledButton}
                loading={isLoading}
                onClick={onsubmitHandler}
              />
            </div>
          </div>
        </div>
      </Container>
    </DashboardLayout>
  );
};

export default ProductEditFields;
