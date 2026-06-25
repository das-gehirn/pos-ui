import { FC } from "react";
import { DownloadIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  SalesAnalysisExportFormat,
  SalesAnalysisReport,
  useSalesAnalysisExportMutation
} from "@/hooks/useSalesAnalysisExportMutation";

interface ExportColumn {
  source: string;
  destination: string;
  dataType: "text" | "number";
}

interface SalesAnalysisExportButtonProps {
  report: SalesAnalysisReport;
  date: Date | null;
  columns: ExportColumn[];
  disabled?: boolean;
}

const formatOptions: { label: string; value: SalesAnalysisExportFormat }[] = [
  { label: "Excel (.xlsx)", value: "excel" },
  { label: "CSV (.csv)", value: "csv" },
  { label: "PDF (.pdf)", value: "pdf" },
  { label: "JSON (.json)", value: "json" }
];

const SalesAnalysisExportButton: FC<SalesAnalysisExportButtonProps> = ({ report, date, columns, disabled }) => {
  const { mutate, isPending } = useSalesAnalysisExportMutation();

  const handleExport = (format: SalesAnalysisExportFormat) => {
    if (!date) return;
    mutate({
      date: date.toISOString(),
      report,
      format,
      columns
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-primary text-white"
          disabled={disabled || isPending || !date}
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <DownloadIcon className="mr-2 h-4 w-4" />
          )}
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {formatOptions.map((option) => (
          <DropdownMenuItem key={option.value} onClick={() => handleExport(option.value)}>
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SalesAnalysisExportButton;
