import DataTable from "./DataTable";
import { memo } from "react";
import { DataTableProps } from "./type";

interface TableProps extends DataTableProps<any, any> {}

const Table = ({
  showExportButton = false,
  title,
  columns,
  actionButtons,
  filters,
  fetchQuery,
  data,
  paginator,
  allowRowSelect,
  searchSelectionOptions,
  selectedDocuments,
  showSearchSelection,
  handleRowClick,
  showSelectColumns,
  description,
  isLoading,
  loadingText,
  showSearch,
  tableActions,
  onExportClick
}: TableProps & { onExportClick?: () => void }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between space-y-2">
        <div>
          {title && <h2 className="text-2xl font-bold tracking-tight">{title}</h2>}
          {description && <p className="text-muted-foreground mt-1">{description}</p>}
        </div>
      </div>
      <DataTable
        handleRowClick={handleRowClick}
        columns={columns}
        showExportButton={showExportButton}
        actionButtons={actionButtons}
        filters={filters}
        fetchQuery={fetchQuery}
        data={data}
        paginator={paginator}
        allowRowSelect={allowRowSelect}
        selectedDocuments={selectedDocuments}
        searchSelectionOptions={searchSelectionOptions}
        showSearchSelection={showSearchSelection}
        showSelectColumns={showSelectColumns}
        isLoading={isLoading}
        loadingText={loadingText}
        showSearch={showSearch}
        tableActions={tableActions}
        onExportClick={onExportClick}
      />
    </div>
  );
};

export default memo(Table);
