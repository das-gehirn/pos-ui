import { ModalActionButtonProps, OptionsProps } from "@/interfaces";
import { FC, useState, useEffect } from "react";
import Modal from "../Modal";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { ArrowRight, Hash, Type } from "lucide-react";
import { PermissionResource } from "@/helpers/permission";
import { useExportMutation } from "@/hooks/useExportMutation";

// Helper functions for file handling
const getMimeType = (format: string): string => {
  switch (format) {
    case "excel":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    case "csv":
      return "text/csv";
    case "json":
      return "application/json";
    default:
      return "application/octet-stream";
  }
};

const getFileExtension = (format: string): string => {
  switch (format) {
    case "excel":
      return "xlsx";
    case "csv":
      return "csv";
    case "json":
      return "json";
    default:
      return "txt";
  }
};

interface ExportModalProps {
  columnsOptions: OptionsProps[];
  tableSchema: any;
  service: PermissionResource;
  openExportModal: boolean;
  onClose: () => void;
}

interface ColumnMapping {
  sourceColumn: string;
  destinationColumn: string;
  isSelected: boolean;
  dataType: "text" | "number";
}

const ExportModal: FC<ExportModalProps> = ({ columnsOptions, tableSchema, service, openExportModal, onClose }) => {
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([]);
  const [exportFormat, setExportFormat] = useState<string>("excel");
  const [exportAll, setExportAll] = useState(false);

  // Initialize column mappings when modal opens
  useEffect(() => {
    if (openExportModal && columnsOptions.length > 0) {
      const mappings = columnsOptions.map((option) => ({
        sourceColumn: option.value,
        destinationColumn: option.label,
        isSelected: true,
        dataType: (tableSchema[option.value]?.dataType || "text") as "text" | "number"
      }));
      setColumnMappings(mappings);
    }
  }, [openExportModal, columnsOptions, tableSchema]);

  const handleColumnSelection = (sourceColumn: string, isSelected: boolean) => {
    setColumnMappings((prev) =>
      prev.map((mapping) => (mapping.sourceColumn === sourceColumn ? { ...mapping, isSelected } : mapping))
    );
  };

  const handleDestinationColumnChange = (sourceColumn: string, destinationColumn: string) => {
    setColumnMappings((prev) =>
      prev.map((mapping) => (mapping.sourceColumn === sourceColumn ? { ...mapping, destinationColumn } : mapping))
    );
  };

  const handleCheckAll = (checked: boolean) => {
    setColumnMappings((prev) => prev.map((mapping) => ({ ...mapping, isSelected: checked })));
    setExportAll(checked);
  };

  const { mutate, isPending } = useExportMutation();

  const selectedColumns = columnMappings.filter((mapping) => mapping.isSelected);
  const hasSelectedColumns = selectedColumns.length > 0;

  const actionButtons: ModalActionButtonProps[] = [
    {
      title: "Cancel",
      action: onClose,
      type: "cancel",
      disabled: isPending
    },
    {
      title: "Confirm",
      disabled: isPending || !hasSelectedColumns,
      loading: isPending,
      action() {
        const exportData = {
          columns: selectedColumns.map((mapping) => ({
            source: mapping.sourceColumn,
            destination: mapping.destinationColumn,
            dataType: mapping.dataType
          })),
          format: exportFormat,
          service
        };

        mutate(
          { payload: exportData },
          {
            onSuccess: (response) => {
              // Handle the blob response from the stream
              const blob = new Blob([response.data], {
                type: getMimeType(exportFormat)
              });
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `${service}_export_${new Date().toISOString().split("T")[0]}.${getFileExtension(
                exportFormat
              )}`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              window.URL.revokeObjectURL(url);
              onClose();
            }
          }
        );
      },
      type: "action"
    }
  ];

  return (
    <Modal
      actionButtons={actionButtons}
      modalTitle="Export Table"
      showModal={openExportModal}
      modalDescription="Select columns to export"
    >
      <div className="space-y-6">
        {/* Export Format Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Export Format</Label>
          <Select value={exportFormat} onValueChange={setExportFormat} disabled={isPending}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select export format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excel">Excel (.xlsx)</SelectItem>
              <SelectItem value="csv">CSV (.csv)</SelectItem>
              <SelectItem value="json">JSON (.json)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Question */}
        <p className="text-sm text-gray-600 dark:text-gray-400">Which columns do you want to export?</p>

        {/* Column Mapping Section */}
        <div className="space-y-4">
          {/* Headers */}
          <div className="grid grid-cols-2 gap-4 text-sm font-medium text-gray-700 dark:text-gray-300">
            <div>Source Table</div>
            <div>Destination Table</div>
          </div>

          {/* Column Mappings */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {columnMappings.map((mapping) => (
              <div key={mapping.sourceColumn} className="grid grid-cols-2 gap-4 items-center">
                {/* Source Column */}
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`source-${mapping.sourceColumn}`}
                    checked={mapping.isSelected}
                    onCheckedChange={(checked) => handleColumnSelection(mapping.sourceColumn, !!checked)}
                    disabled={isPending}
                  />
                  <Label htmlFor={`source-${mapping.sourceColumn}`} className="cursor-pointer text-sm">
                    {mapping.sourceColumn}
                  </Label>
                </div>

                {/* Arrow and Destination Column */}
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                  <div className="flex items-center gap-2 flex-1">
                    {/* Data Type Icon */}
                    {mapping.dataType === "number" ? (
                      <Hash className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Type className="h-4 w-4 text-gray-500" />
                    )}

                    {/* Destination Column Input */}
                    <Input
                      value={mapping.destinationColumn}
                      onChange={(e) => handleDestinationColumnChange(mapping.sourceColumn, e.target.value)}
                      className="text-sm"
                      disabled={isPending}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Export All Checkbox */}
          <div className="flex items-center gap-2 pt-2 border-t">
            <Checkbox onCheckedChange={handleCheckAll} checked={exportAll} id="exportAll" disabled={isPending} />
            <Label htmlFor="exportAll" className="cursor-pointer text-sm">
              Export all
            </Label>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ExportModal;
