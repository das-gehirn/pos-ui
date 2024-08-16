import { Calendar, Section } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/table/DataTableColumnHeader";
import { DataFilterProps } from "@/components/table/type";
import { startCase } from "lodash";
import { format } from "date-fns";
import { formatCurrency } from "@/helpers";
import { ExpenditureProps } from "@/interfaces/expenditure";

export const expenditureTableFilters: DataFilterProps[] = [
  {
    column: "createdAt",
    options: [],
    title: "Created on",
    extra: {
      mainIcon: Calendar
    },
    isDate: true
  },
  {
    column: "type",
    options: [
      {
        label: "Goods",
        value: "goods"
      },
      {
        label: "Services",
        value: "services"
      }
    ],
    title: "Expenditure type",
    extra: {
      mainIcon: Section
    }
  }
];

export const expenditureTableSchema: ColumnDef<ExpenditureProps>[] = [
  {
    accessorKey: "item",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Item" />,
    cell: ({ row }) => <div className="flex space-x-2">{row.getValue("item")}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },

  {
    accessorKey: "quantity",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Quantity" />,
    cell: ({ row }) => {
      return <div className="flex space-x-2">{row.getValue("quantity")}</div>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: "pricePerQuantity",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Price per quantity" />,
    cell: ({ row }) => {
      return <div className="flex space-x-2">{formatCurrency({ value: row.getValue("pricePerQuantity") || 0 })}</div>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: "modeOfPayment",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Mode of Payment" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="truncate font-medium">{startCase(row.getValue("modeOfPayment"))}</span>
        </div>
      );
    }
  },
  {
    accessorKey: "type",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
    cell: ({ row }) => {
      return <div className="flex space-x-2">{startCase(row.getValue("type"))}</div>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: "expenseHead",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Expense Head" />,
    cell: ({ row: { original } }) => {
      return (
        <div className="flex space-x-2">
          <span className="truncate font-medium">{`${original?.expenseHeadData?.title}`}</span>
        </div>
      );
    }
  },
  {
    accessorKey: "subExpense",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Sub expense" />,
    cell: ({ row: { original } }) => {
      return (
        <div className="flex space-x-2">
          <span className="truncate font-medium">{`${original?.subExpenseHeadData?.title.toUpperCase()}`}</span>
        </div>
      );
    }
  },
  {
    accessorKey: "createdBy",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created By" />,
    cell: ({ row: { original } }) => {
      return (
        <div className="flex space-x-2">
          <span className="truncate font-medium">
            {`${original?.createdByData?.firstName} ${original?.createdByData?.lastName}`}
          </span>
        </div>
      );
    }
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => {
      const date: Date = row.getValue("createdAt");
      return <div className="flex space-x-2">{format(date, "dd-MM-y")}</div>;
    }
  }
];
