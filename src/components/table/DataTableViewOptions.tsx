import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Columns, DownloadIcon } from "lucide-react";
import { Table } from "@tanstack/react-table";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
  showExportButton?: boolean;
  onExportClick?: () => void;
}

export function DataTableViewOptions<TData>({
  table,
  showExportButton = false,
  onExportClick,
}: DataTableViewOptionsProps<TData>) {
  return (
    <div className="flex gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto lg:flex"
          >
            <Columns className="mr-2 min-h-4 min-w-4" />
            Columns
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== "undefined" && column.getCanHide()
            )
            .map((column) => {
              const columnDef = column.columnDef ;
              //@ts-expect-error - header function may return JSX with title prop
              const title = (typeof columnDef.header === 'function' ? columnDef.header({column})?.props.title : column.id);              
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize cursor-pointer"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {title || column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
      {showExportButton && (
        <div className="export-button">
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-primary text-white"
            onClick={onExportClick}
          >
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      )}
    </div>
  );
}
