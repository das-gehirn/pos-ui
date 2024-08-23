import { DefaultPluginProps } from ".";
import { ProductBrandProps } from "./productBrands";
import { ProductCategoryProps } from "./productCategories";
import { ProductCodeProps } from "./productCode";
import { ProductQuantityProps } from "./productQuantity";
import { ProductUnitProps } from "./productUnits";

export type ProductStatus = "active" | "inactive" | "draft";
export type BarcodeSymbology = "code25" | "code39" | "code128" | "ean5" | "ean13" | "upca" | "upce";
export interface DimensionProps {
  height?: number;
  width?: number;
  length?: number;
}
export const productBarcodeSymbology: BarcodeSymbology[] = [
  "code128",
  "code25",
  "code39",
  "ean13",
  "ean5",
  "upca",
  "upce"
];
export const productStatus: ProductStatus[] = ["active", "draft", "inactive"];
export type ProductAvailability = "onlineOnly" | "offlineOnly" | "bothOnlineAndOffLine";
export interface ProductProps extends DefaultPluginProps {
  _id?: string;
  id?: string;
  name: string;
  productCodeId: string;
  categoryId: string;
  supplierId: string;
  brandId: string;
  barcodeSymbology: BarcodeSymbology;
  unitId: string;
  productUnitPrice: number;
  productSellingPrice: number;
  taxId?: string;
  taxType?: "inclusive" | "exclusive";
  warehouseIds?: string[];
  accountId?: string;
  alertQuantity: number;
  description?: string;
  status: ProductStatus;
  isFeatured?: boolean;
  tags?: string[];
  availability?: ProductAvailability;
  dimensions?: DimensionProps;
  weight?: number;
  canExpire?: boolean;
  expirationDate?: Date | null;
  SKU?: string;
  primaryImageId?: string;
  secondaryImages?: string[];

  // Virtuals
  productBrand?: ProductBrandProps;
  // productSupplier?: SupplierProps;
  productCategory?: ProductCategoryProps;
  productQuantity?: ProductQuantityProps;
  productUnit?: ProductUnitProps;
  productCode?: ProductCodeProps;
  totalProductPrice?: number;
}
