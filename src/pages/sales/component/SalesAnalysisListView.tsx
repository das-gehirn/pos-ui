import SimpleTable from "@/components/table/SimpleTable";
import { SimpleTableColumn } from "@/components/table/type";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/helpers";
import { FC } from "react";
import SalesAnalysisExportButton from "./SalesAnalysisExportButton";

interface SalesAnalysisListViewProps {
  selectedDate: Date | null;
  salesByProduct: { productName: string; category?: string; totalQuantity: number; totalPrice: number }[];
  salesByCategoryReport: {
    category: string;
    totalItemsSold: number;
    totalQuantitySold: number;
  }[];
  salesByCashier: { name: string; totalQuantity: number; totalSales: number }[];
}

const SalesAnalysisListView: FC<SalesAnalysisListViewProps> = ({
  selectedDate,
  salesByProduct,
  salesByCategoryReport,
  salesByCashier
}) => {
  const salesByProductsColumns: SimpleTableColumn[] = [
    { key: "productName", label: "Product Name" },
    { key: "category", label: "Category" },
    { key: "totalQuantity", label: "Quantity Sold", className: "text-center" },
    { key: "totalPrice", label: "Total Amount", className: "text-right" }
  ];
  const salesByCategoriesColumns: SimpleTableColumn[] = [
    { key: "category", label: "Product Categories" },
    { key: "totalQuantitySold", label: "Quantity Sold", className: "text-center" },
    { key: "totalItemsSold", label: "Total Amount Sold", className: "text-right" }
  ];
  const salesByCashierColumns: SimpleTableColumn[] = [
    { key: "name", label: "Cashier" },
    { key: "totalQuantity", label: "Quantity Sold", className: "text-center" },
    { key: "totalSales", label: "Total Sales", className: "text-right" }
  ];

  // Column definitions used for server-side export (source -> destination mapping).
  const salesByProductExportColumns = [
    { source: "productName", destination: "Product Name", dataType: "text" as const },
    { source: "category", destination: "Category", dataType: "text" as const },
    { source: "totalQuantity", destination: "Quantity Sold", dataType: "number" as const },
    { source: "totalPrice", destination: "Total Amount", dataType: "number" as const }
  ];
  const salesByCategoryExportColumns = [
    { source: "category", destination: "Product Categories", dataType: "text" as const },
    { source: "totalQuantitySold", destination: "Quantity Sold", dataType: "number" as const },
    { source: "totalItemsSold", destination: "Total Amount Sold", dataType: "number" as const }
  ];
  const salesByCashierExportColumns = [
    { source: "name", destination: "Cashier", dataType: "text" as const },
    { source: "totalQuantity", destination: "Quantity Sold", dataType: "number" as const },
    { source: "totalSales", destination: "Total Sales", dataType: "number" as const }
  ];

  const calculateTotals = () => {
    return {
      salesByProductTotalQuantity: salesByProduct.reduce((total, item) => total + item.totalQuantity, 0),
      salesByProductTotalPrice: salesByProduct.reduce((total, item) => total + item.totalPrice, 0),
      salesByCategoryTotalQuantity: salesByCategoryReport.reduce((total, item) => total + item.totalQuantitySold, 0),
      salesByCategoryTotalPrice: salesByCategoryReport.reduce((total, item) => total + item.totalItemsSold, 0),
      salesByCashierTotalQuantity: salesByCashier.reduce((total, item) => total + item.totalQuantity, 0),
      salesByCashierTotalPrice: salesByCashier.reduce((total, item) => total + item.totalSales, 0)
    };
  };
  const salesByProductData = salesByProduct.map((d) => {
    return {
      ...d,
      category: d.category || "-",
      totalPrice: formatCurrency({ value: d.totalPrice, showCurrencySign: false })
    };
  });
  const salesByCategory = salesByCategoryReport.map((d) => {
    return {
      ...d,
      totalItemsSold: formatCurrency({ value: d.totalItemsSold, showCurrencySign: false })
    };
  });
  const salesByCashierData = salesByCashier.map((d) => {
    return {
      ...d,
      totalSales: formatCurrency({ value: d.totalSales, showCurrencySign: false })
    };
  });

  const salesByProductFooterData = [
    {
      productName: "Total",
      category: "",
      totalQuantity: calculateTotals().salesByProductTotalQuantity,
      totalPrice: formatCurrency({ value: calculateTotals().salesByProductTotalPrice })
    }
  ];
  const salesByCategoryFooterData = [
    {
      category: "Total",
      totalQuantitySold: calculateTotals().salesByCategoryTotalQuantity,
      totalItemsSold: formatCurrency({ value: calculateTotals().salesByCategoryTotalPrice })
    }
  ];
  const salesByCashierFooterData = [
    {
      name: "Total",
      totalQuantity: calculateTotals().salesByCashierTotalQuantity,
      totalSales: formatCurrency({ value: calculateTotals().salesByCashierTotalPrice })
    }
  ];
  return (
    <Tabs defaultValue="sales-by-products" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="sales-by-products">Sales by Products</TabsTrigger>
        <TabsTrigger value="sales-by-categories">Sales by Categories</TabsTrigger>
        <TabsTrigger value="sales-by-cashier">Sales by Cashier</TabsTrigger>
      </TabsList>
      <TabsContent value="sales-by-products">
        <div className="flex items-center justify-end my-3">
          <SalesAnalysisExportButton
            report="product"
            date={selectedDate}
            columns={salesByProductExportColumns}
            disabled={salesByProduct.length === 0}
          />
        </div>
        <SimpleTable columns={salesByProductsColumns} data={salesByProductData} footerData={salesByProductFooterData} />
      </TabsContent>
      <TabsContent value="sales-by-categories">
        <div className="flex items-center justify-end my-3">
          <SalesAnalysisExportButton
            report="category"
            date={selectedDate}
            columns={salesByCategoryExportColumns}
            disabled={salesByCategoryReport.length === 0}
          />
        </div>
        <SimpleTable columns={salesByCategoriesColumns} data={salesByCategory} footerData={salesByCategoryFooterData} />
      </TabsContent>
      <TabsContent value="sales-by-cashier">
        <div className="flex items-center justify-end my-3">
          <SalesAnalysisExportButton
            report="cashier"
            date={selectedDate}
            columns={salesByCashierExportColumns}
            disabled={salesByCashier.length === 0}
          />
        </div>
        {salesByCashier.length > 0 ? (
          <SimpleTable columns={salesByCashierColumns} data={salesByCashierData} footerData={salesByCashierFooterData} />
        ) : (
          <h1 className="text-center my-10">No Data found</h1>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default SalesAnalysisListView;
