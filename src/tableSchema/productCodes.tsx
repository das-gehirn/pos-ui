import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/table/DataTableColumnHeader";
import { ProductCodeProps } from "@/interfaces/productCode";
import { format } from "date-fns";

export const productCodeSchema: ColumnDef<ProductCodeProps>[] = [
  {
    accessorKey: "code",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Product Code" />,
    cell: ({ row }) => <div className="flex space-x-2">{row.getValue("code")}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    size: 12
  },
  {
    accessorKey: "description",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Code Description" />,
    cell: ({ row }) => <div className="flex space-x-2">{row.getValue("description")}</div>,
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
