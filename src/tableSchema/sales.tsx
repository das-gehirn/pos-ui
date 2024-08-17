import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/table/DataTableColumnHeader";
import { SalesProps } from "@/interfaces/sales";
import { formatCurrency } from "@/helpers";
import { startCase } from "lodash";
import { DataFilterProps } from "@/components/table/type";
import { mopArr } from "@/defaults";
import { Calendar, HandCoins } from "lucide-react";
import { format } from "date-fns";
export const MOP_OPTIONS = mopArr.map((mop) => {
  return {
    label: startCase(mop),
    value: mop
  };
});
export const salesTableFilters: DataFilterProps[] = [
  {
    column: "modeOfPayment",
    options: MOP_OPTIONS,
    title: "Mode of payment",
    extra: {
      mainIcon: HandCoins
    }
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

export const salesTableSchema = ({ isAdmin }: { isAdmin?: boolean }): ColumnDef<SalesProps>[] => {
  const schema: ColumnDef<SalesProps>[] = [
    {
      accessorKey: "receiptNumber",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Receipt #" />,
      cell: ({ row }) => {
        return <div className="flex space-x-2">{row.getValue("receiptNumber")}</div>;
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      size: 400
    },
    {
      accessorKey: "customerId",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">{`${row.original?.customerData?.firstName || ""} ${
            row.original?.customerData?.lastName || ""
          }`}</div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      }
    },
     {
      accessorKey: "totalAmount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Total Amount" />,
      cell: ({ row }) => <div className="flex space-x-2">{formatCurrency({value: row.original?.invoiceData?.totalAmount || 0})}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      size: 12
    },
    {
      accessorKey: "amountPaid",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Amount Paid" />,
      cell: ({ row }) => <div className="flex space-x-2">{formatCurrency({ value: row.getValue("amountPaid") })}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      size: 12
    },
    {
      accessorKey: "modeOfPayment",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Mode of Payment" />,
      cell: ({ row }) => <div className="flex space-x-2">{startCase(row.getValue("modeOfPayment"))}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      }
    },
    {
      accessorKey: "changeGiven",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Change Given" />,
      cell: ({ row }) => {
        return <div className="flex space-x-2">{formatCurrency({ value: row.getValue("changeGiven") })}</div>;
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      }
    },
    {
      accessorKey: "arrears",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Arrears" />,
      cell: ({ row }) => {
        return <div className="flex space-x-2">{formatCurrency({ value: row.getValue("arrears") })}</div>;
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      }
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="CreatedAt" />,
      cell: ({ row }) => {
        const date: Date = row.getValue("createdAt");
        return <div className="flex space-x-2">{format(date, "dd-MM-y")}</div>;
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      }
    }
  ];
  if (isAdmin) {
    schema.push({
      accessorKey: "createdBy",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Teller" />,
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">{`${row.original?.createdByData?.firstName || ""} ${
            row.original?.createdByData?.lastName || ""
          }`}</div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      size: 400
    });
  }
  return schema;
};
