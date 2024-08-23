import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/table/DataTableColumnHeader";
import { format } from "date-fns";
import { formatCurrency } from "@/helpers";

export const stockCreditorsTotalsSchema: ColumnDef<StockCreditorsTotalsProps>[] = [
  {
    accessorKey: "supplierName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Supplier Name" />,
    cell: ({ row }) => <div className="flex space-x-2">{row.getValue("supplierName")}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    size: 12
  },
  {
    accessorKey: "totalStockCredit",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Total Credit Amount" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          {formatCurrency({
            value: row.getValue("totalStockCredit") || 0
          })}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: "lastRecordedDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Last Recorded Date" />,
    cell: ({ row }) => {
      const date: Date = row.getValue("lastRecordedDate");
      return <div className="flex space-x-2">{format(date, "dd-MM-y")}</div>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  }
];
