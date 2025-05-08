import { DataTableColumnHeader } from "@/components/table/DataTableColumnHeader";
import { StockAdjustmentProps } from "@/interfaces/stockAdjustment";
import { ColumnDef } from "@tanstack/react-table";
import { startCase } from "lodash";

export const stockAdjustmentTableSchema: ColumnDef<StockAdjustmentProps>[] = [
  {
    accessorKey: "productId",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Product" />,
    cell: ({ row }) => <div className="flex space-x-2">{row.original?.product?.name}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Quantity Adjusted" />,
    cell: ({ row }) => {
      return <div className="flex space-x-2">{row.getValue("quantity")}</div>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: "type",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Adjustment Type" />,
    cell: ({ row }) => {
      return <div className="flex space-x-2">{startCase(row.getValue("type"))}</div>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  }
];
