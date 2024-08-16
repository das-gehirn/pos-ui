import { ChevronLeftIcon, ChevronRightIcon, ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { Table } from "@tanstack/react-table";

import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import PaginationNumbers from "./PaginationNumbers";
import { Paginator } from "./type";
import { useSetQueryParam } from "./hooks/useSetQueryParam";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  paginator: Paginator | null;
}
export function DataTablePagination<TData>({ table, paginator }: DataTablePaginationProps<TData>) {
  const { setQueryParam, getQueryParam } = useSetQueryParam();

  const handleGoToNextOrPreviousPage = (pageNumber: number) => {
    if (pageNumber) {
      setQueryParam("currentPage", String(pageNumber));
    }
  };
  const totalPageToView = Math.ceil((paginator?.totalDocuments || 0) / (paginator?.perPage || 0));
  return (
    <>
      {paginator && paginator.totalDocuments > 0 && (
        <div className="flex items-center justify-between px-2 overflow-x-scroll md:flex-row flex-co my-5">
          <div className="flex-1 text-sm text-muted-foreground">
            {paginator.page} of
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex items-center lg:space-x-8 md:flex-row flex-col">
            {
              <div className="flex items-center lg:space-x-2 md:flex-row flex-col">
                <p className="text-sm font-medium">Rows per page</p>
                <Select
                  value={String(getQueryParam("limit") || 30)}
                  onValueChange={(value) => {
                    setQueryParam("limit", String(value));
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={paginator?.perPage} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[30, 50, 100, 150].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            }
            <div className="flex md:w-[100px] items-center justify-center text-sm font-medium">
              <span className="mx-1 ml-0"> Page {paginator?.page}</span>
              <span className="mx-1">of {Number(paginator?.totalPages)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="h-8 w-8 p-0 flex disabled:bg-gray-100"
                onClick={() => handleGoToNextOrPreviousPage(1)}
                disabled={paginator?.page === 1}
              >
                <span className="sr-only">Go to first page</span>
                <ArrowLeftIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0 disabled:bg-gray-100 disabled:cursor-not-allowed"
                onClick={() => handleGoToNextOrPreviousPage(paginator?.page! - 1)}
                disabled={paginator?.page === 1}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <PaginationNumbers
                itemsPerPage={paginator?.perPage!}
                page={paginator?.page!}
                totalDocument={paginator?.totalDocuments as number}
              />
              <Button
                variant="outline"
                className="h-8 w-8 p-0 disabled:bg-gray-100"
                onClick={() => handleGoToNextOrPreviousPage(paginator?.page! + 1)}
                disabled={paginator.totalPages === 1 || paginator?.page === totalPageToView}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0 flex disabled:bg-gray-100"
                onClick={() => handleGoToNextOrPreviousPage(paginator?.totalPages)}
                disabled={paginator.totalPages === 1 || paginator?.page === totalPageToView}
              >
                <span className="sr-only">Go to last page</span>
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
