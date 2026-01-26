import { ListFilter, X } from "lucide-react";
import { Table } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { DataTableViewOptions } from "../table/DataTableViewOptions";

import { DataTableFacetedFilter } from "./TableFacetedFilter";
import DataFacetedFilterForNumberDate from "./DataFacetedFilterForNumberDate";
import { useCallback, useState } from "react";
import { useSetQueryParam } from "./hooks/useSetQueryParam";

import Dropdown from "./Dropdown";
import { DataFilterProps, TableActionProps } from "./type";
import { OptionsProps } from "./type";
import { TableActions } from "./TableActions";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  showExportButton?: boolean;
  filters?: DataFilterProps[];
  showSearchSelection?: boolean;
  searchSelectionOptions?: OptionsProps[];
  showSelectColumns?: boolean;
  showSearch?: boolean;
  tableActions?: TableActionProps[];
  onExportClick?: () => void;
}
export function DataTableToolbar<TData>({
  table,
  showExportButton = false,
  filters,
  searchSelectionOptions,
  showSearchSelection,
  showSelectColumns = true,
  showSearch = true,
  tableActions,
  onExportClick
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const { setQueryParam, getQueryParam } = useSetQueryParam();
  const [value, setValue] = useState<string>(getQueryParam("search") || "");
  const [searchSelection, setSearchSelection] = useState<string>(getQueryParam("searchSelection") || "");

  const handleOnChange = useCallback((event: any) => {
    const { target: { value = "" } = {} } = event;
    setValue(event.target.value);

    if (value.length >= 3 || value.length === 0) {
      setQueryParam("search", value);
    }
  }, []);

  const handleSelectedField = useCallback((value: string) => {
    setSearchSelection(value);
    if (!(searchSelection && searchSelection === value)) {
      setQueryParam("searchSelection", value);
    }
  }, []);

  return (
    <>
      <div className="flex flex-col lg:flex-row items-center justify-between mb-5">
        <div className="flex flex-1 items-center">
          {showSearchSelection && showSearch && (
            <Dropdown
              options={searchSelectionOptions}
              icon={<ListFilter />}
              className="rounded-r-none h-10 hover:bg-transparent border-gray-100"
              handleSelectedField={handleSelectedField}
              defaultValue={searchSelection}
            />
          )}
          {showSearch && (
            <Input
              placeholder="Search..."
              value={value}
              onChange={handleOnChange}
              className="h-10 w-full lg:w-[250px] my-2 lg:my-0 rounded-l-none border border-gray-100"
            />
          )}
        </div>
        {showSelectColumns && <DataTableViewOptions table={table} showExportButton={showExportButton} onExportClick={onExportClick} />}
      </div>
      <div className="flex justify-between items-center flex-wrap">
        {/* TABLE FILTERS */}
        <div className="flex items-center justify-between my-5  overflow-x-scroll">
          <div>
            <div className="filters flex gap-2">
              {filters &&
                filters.length > 0 &&
                filters.map((filter, index) => {
                  if (!table.getColumn(filter.column)) return null;

                  if (filter.isNumber || filter.isDate) {
                    return <DataFacetedFilterForNumberDate key={index} filter={filter} isDate={filter.isDate} />;
                  }

                  return (
                    <DataTableFacetedFilter
                      column={filter.column}
                      title={filter.title}
                      options={filter.options}
                      extra={filter.extra}
                      key={index}
                    />
                  );
                })}
            </div>
            <div className="reset">
              {isFiltered && (
                <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
                  Reset
                  <X className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* TABLE ACTION */}
        {tableActions && tableActions.length > 0 && (
          <div>
            <TableActions tableActions={tableActions} />
          </div>
        )}
      </div>
    </>
  );
}
