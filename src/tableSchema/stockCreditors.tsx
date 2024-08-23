import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/table/DataTableColumnHeader";
import { format } from "date-fns";
import { formatCurrency } from "@/helpers";
import { StockCreditorProps } from "@/interfaces/stockCreditors";
import { DataFilterProps } from "@/components/table/type";
import { Banknote, Calendar } from "lucide-react";

export const stockCreditorsTableFilters: DataFilterProps[] = [
  {
    column: "amount",
    options: [],
    title: "Amount",
    extra: {
      mainIcon: Banknote
    },
    isNumber: true
  },
  {
    column: "createdAt",
    options: [],
    title: "Recorded At",
    isDate: true,
    extra: {
      mainIcon: Calendar
    }
  }
];
export const stockCreditorsSchema: ColumnDef<StockCreditorProps>[] = [
  {
    accessorKey: "stockId",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Stock Delivery ID" />,
    cell: ({ row: { original } }) => <div className="flex space-x-2">{original?.stockData?.deliveryId || "N/A"}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    size: 12
  },
  {
    accessorKey: "amount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Stock Amount" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          {formatCurrency({
            value: row.getValue("amount") || 0
          })}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: "supplierId",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Supplier" />,
    cell: ({ row: { original } }) => <div className="flex space-x-2">{original?.supplierData?.name || "N/A"}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    size: 12
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
