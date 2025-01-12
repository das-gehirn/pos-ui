import SimpleTable from "@/components/table/SimpleTable";
import { SimpleTableColumn } from "@/components/table/type";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/helpers";
import { FC } from "react";

interface SalesAnalysisListViewProps {
  salesByProduct: { productName: string; totalQuantity: number; totalPrice: number }[];
  salesByCategoryReport: {
    category: string;
    totalItemsSold: number;
    totalQuantitySold: number;
  }[];
}

const SalesAnalysisListView: FC<SalesAnalysisListViewProps> = ({ salesByProduct, salesByCategoryReport }) => {
  const salesByProductsColumns: SimpleTableColumn[] = [
    { key: "productName", label: "Product Name" },
    { key: "totalQuantity", label: "Quantity Sold", className: "text-center" },
    { key: "totalPrice", label: "Total Amount", className: "text-right" }
  ];
  const salesByCategoriesColumns: SimpleTableColumn[] = [
    { key: "category", label: "Product Categories" },
    { key: "totalQuantitySold", label: "Quantity Sold", className: "text-center" },
    { key: "totalItemsSold", label: "Total Amount Sold", className: "text-right" }
  ];

  const calculateTotals = () => {
    return {
      salesByProductTotalQuantity: salesByProduct.reduce((total, item) => total + item.totalQuantity, 0),
      salesByProductTotalPrice: salesByProduct.reduce((total, item) => total + item.totalPrice, 0),
      salesByCategoryTotalQuantity: salesByCategoryReport.reduce((total, item) => total + item.totalQuantitySold, 0),
      salesByCategoryTotalPrice: salesByCategoryReport.reduce((total, item) => total + item.totalItemsSold, 0)
    };
  };
  const salesByProductData = salesByProduct.map((d) => {
    return {
      ...d,
      totalPrice: formatCurrency({ value: d.totalPrice, showCurrencySign: false })
    };
  });
  const salesByCategory = salesByCategoryReport.map((d) => {
    return {
      ...d,
      totalItemsSold: formatCurrency({ value: d.totalItemsSold, showCurrencySign: false })
    };
  });

  const salesByProductFooterData = [
    {
      productName: "Total",
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
  return (
    <Tabs defaultValue="sales-by-products" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="sales-by-products">Sales by Products</TabsTrigger>
        <TabsTrigger value="sales-by-categories">Sales by Categories</TabsTrigger>
        <TabsTrigger value="sales-by-cashier">Sales by Cashier</TabsTrigger>
      </TabsList>
      <TabsContent value="sales-by-products">
        <SimpleTable columns={salesByProductsColumns} data={salesByProductData} footerData={salesByProductFooterData} />
      </TabsContent>
      <TabsContent value="sales-by-categories">
        <SimpleTable columns={salesByCategoriesColumns} data={salesByCategory} footerData={salesByCategoryFooterData} />
      </TabsContent>
      <TabsContent value="sales-by-cashier">
        <h1 className="text-center">Coming soon</h1>
      </TabsContent>
    </Tabs>
  );
};

export default SalesAnalysisListView;
