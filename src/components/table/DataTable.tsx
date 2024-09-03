import { useEffect, useRef, useState } from "react";
import { DataTableToolbar } from "./TableToolbar";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import { DataTablePagination } from "./DataTablePagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import TableBodyItem from "./TableBodyItem";
import NoDataImg from "./no-data.svg";
import { DataTableRowActions } from "./DataTableRowActions";
import { Checkbox } from "../ui/checkbox";
import { FetchLoader } from "./FetchLoader";
import { DataTableProps } from "./type";
import { useSetQueryParam } from "./hooks/useSetQueryParam";
export function DataTable<TData, TValue>({
  columns,
  showExportButton = false,
  filters,
  actionButtons,
  allowRowSelect,
  data,
  paginator,
  showSearchSelection = false,
  searchSelectionOptions,
  showSelectColumns = true,
  handleRowClick,
  isLoading,
  loadingText,
  showSearch,
  tableActions
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [tableColumn, setTableColumn] = useState(columns);
  const initialized = useRef(false);

  const { getQueryParam, setQueryParam } = useSetQueryParam();

  const [queryColumn] = useState(getQueryParam("columns") || "");

  const columnsForDefaultValues =
    columns && columns.length
      ? columns
          .map((column) => {
            if ("accessorKey" in column) {
              return column.accessorKey;
            }
            return;
          })
          .filter((columnName: any) => columnName)
      : [];

  useEffect(() => {
    if (!queryColumn) {
      setQueryParam("columns", columnsForDefaultValues.join(","));
      setQueryParam("limit", (30).toString());
      setQueryParam("currentPage", (1).toString());
    }
  }, []);

  // ADD TABLE MENU
  useEffect(() => {
    if (!initialized.current) {
      if (actionButtons && actionButtons.length) {
        setTableColumn((prevCols) => [
          ...prevCols,
          {
            id: "actions",
            cell: ({ row }) => <DataTableRowActions actionButtons={actionButtons} row={row} />
          }
        ]);
      }

      if (allowRowSelect) {
        setTableColumn((prevCols) => [
          {
            id: "select",
            header: ({ table }) => (
              <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="translate-y-[2px]"
              />
            ),
            cell: ({ row }) => (
              <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              />
            ),
            enableSorting: false,
            enableHiding: false
          },
          ...prevCols
        ]);
      }
      initialized.current = true;
    }
  }, []);

  // REACT TABLE STUFF
  const table = useReactTable({
    data,
    columns: tableColumn,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: { pagination: { pageSize: paginator?.perPage || 30 } },
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualExpanding: true
  });

  return (
    <div className="">
      <DataTableToolbar
        table={table}
        showExportButton={showExportButton}
        filters={filters}
        searchSelectionOptions={searchSelectionOptions}
        showSearchSelection={showSearchSelection}
        showSelectColumns={showSelectColumns}
        showSearch={showSearch}
        tableActions={tableActions}
      />
      <div className="rounded border border-[#f6f6f6] border-md mt-5">
        <Table className="-striped -highlight">
          <TableHeader className="w-full">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={`table-head__title`}
                      style={{ width: `${header.getSize()}px` }}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="w-full">
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9}>
                  <div className="flex justify-center items-center h-full flex-col gap-4 min-h-[350px]">
                    <FetchLoader />
                    {loadingText && <h3>{loadingText}</h3>}
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table
                .getRowModel()
                .rows.map((row) => <TableBodyItem row={row} key={row.id} handleRowClick={handleRowClick} />)
            ) : (
              <TableRow className="w-full">
                <TableCell colSpan={9} className="text-center w-full">
                  <div className="p-10 flex items-center justify-center flex-col gap-4  w-full">
                    <img src={NoDataImg} alt="" style={{ width: "10%" }} />
                    <p className="text-lg">No results.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {!isLoading && data.length > 0 && <DataTablePagination table={table} paginator={paginator} />}
    </div>
  );
}

export default DataTable;
