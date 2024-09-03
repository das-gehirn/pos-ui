import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/table/DataTableColumnHeader";
import { format } from "date-fns";
import { formatCurrency } from "@/helpers";
import { StockCreditorPaymentProps } from "@/interfaces/stockPayments";
import { startCase } from "lodash";

export const stockPaymentSchema: ColumnDef<StockCreditorPaymentProps>[] = [
  {
    accessorKey: "stockId",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Stock Delivery Code" />,
    cell: ({ row: { original } }) => <div className="flex space-x-2">{original?.stockData?.deliveryId || "N/A"}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    size: 12
  },
  {
    accessorKey: "supplierId",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Supplier" />,
    cell: ({ row: { original } }) => <div className="flex space-x-2">{original?.supplierData?.name}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    size: 12
  },
  {
    accessorKey: "amountPaid",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Amount Paid" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          {formatCurrency({
            value: row.getValue("amountPaid") || 0
          })}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: "modeOfPayment",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Mode of Payment" />,
    cell: ({ row }) => <div className="flex space-x-2">{startCase(row.getValue("modeOfPayment"))}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    size: 12
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Payment Date" />,
    cell: ({ row }) => {
      const date: Date = row.getValue("createdAt");
      return <div className="flex space-x-2">{format(date, "dd-MM-y")}</div>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  }
];
