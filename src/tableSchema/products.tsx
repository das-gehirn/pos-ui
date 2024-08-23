import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/table/DataTableColumnHeader";
import { format } from "date-fns";
import { ProductProps, ProductStatus } from "@/interfaces/products";
import TableStatus from "@/components/TableStatus";
import { Calendar, Currency, Settings2 } from "lucide-react";
import { DataFilterProps } from "@/components/table/type";
import { formatCurrency } from "@/helpers";

export const PRODUCT_STATUS_OPTIONS = [
  {
    label: "Active",
    value: "active"
  },
  {
    label: "Draft",
    value: "draft"
  },
  {
    label: "Inactive",
    value: "inactive"
  }
];
export const productTableFilters: DataFilterProps[] = [
  {
    column: "status",
    options: PRODUCT_STATUS_OPTIONS,
    title: "Status",
    extra: {
      mainIcon: Settings2
    }
  },
  {
    column: "productUnitPrice",
    options: [],
    title: "Unit Price",
    isNumber: true,
    extra: {
      mainIcon: Currency
    }
  },
  {
    column: "createdAt",
    options: [],
    title: "Created At",
    isDate: true,
    extra: {
      mainIcon: Calendar
    }
  }
];
const statusColors: { [key in ProductStatus]: { bg: string; text: string; circleBg?: string } } = {
  active: {
    bg: "bg-green-50",
    text: "text-green-600",
    circleBg: "bg-green-600"
  },
  draft: {
    bg: "bg-orange-50",
    text: "text-orange-500",
    circleBg: "bg-orange-500"
  },
  inactive: {
    bg: "bg-gray-50",
    text: "text-gray-500",
    circleBg: "bg-gray-500"
  }
};
export const productTableSchema: ColumnDef<ProductProps>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Product Name" />,
    cell: ({ row }) => <div className="flex space-x-2">{row.getValue("name")}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableHiding: true
  },
  {
    accessorKey: "codeId",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Product Code" />,
    cell: ({ row }) => {
      return <div className="flex space-x-2">{row.original?.productCode?.code}</div>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: "brandId",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Product Brand" />,
    cell: ({ row }) => <div className="flex space-x-2">{row.original?.productBrand?.name}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: "categoryId",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
    cell: ({ row }) => <div className="flex space-x-2">{row.original?.productCategory?.name}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Quantity" />,
    cell: ({ row }) => <div className="flex space-x-2">{row.original?.productQuantity?.availableQuantity}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: "productUnitPrice",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Unit Price" />,
    cell: ({ row }) => {
      const value: number = row.getValue("productUnitPrice");
      return (
        <div className="flex space-x-2">
          &#8373;
          {formatCurrency({
            value,
            currencyDisplay: "symbol",
            showCurrencySign: false
          })}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: "productSellingPrice",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Selling Price" />,
    cell: ({ row }) => {
      const value: number = row.getValue("productSellingPrice");
      return (
        <div className="flex space-x-2">
          &#8373;
          {formatCurrency({
            value,
            currencyDisplay: "symbol",
            showCurrencySign: false
          })}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: "totalProductPrice",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Total Stock Amount" />,
    cell: ({ row }) => {
      const value: number = row.getValue("totalProductPrice");
      return (
        <div className="flex space-x-2">
          &#8373;
          {formatCurrency({
            value,
            currencyDisplay: "symbol",
            showCurrencySign: false
          })}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status: ProductStatus = row.getValue("status");
      const statusFiltered = PRODUCT_STATUS_OPTIONS.find((stat) => stat.value === status)?.label;

      return (
        <div className="flex items-center justify-center">
          {status && (
            <TableStatus
              bg={statusColors[status]?.bg}
              text={statusFiltered || ""}
              textColor={statusColors[status]?.text}
              circleBg={statusColors[status]?.circleBg}
            />
          )}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => {
      const date: Date = row.getValue("createdAt");
      return <div className="flex space-x-2">{format(date, "dd-MM-y")}</div>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  }
];
