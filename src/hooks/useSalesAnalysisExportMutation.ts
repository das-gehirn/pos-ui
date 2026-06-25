import { useMutation } from "@tanstack/react-query";

import { getErrorMessageFromApi } from "@/utils";
import { useBaseRequestService } from "./request/useAxiosPrivate";
import { toast } from "sonner";

export type SalesAnalysisReport = "product" | "category" | "cashier";
export type SalesAnalysisExportFormat = "excel" | "csv" | "pdf" | "json";

interface SalesAnalysisExportColumn {
  source: string;
  destination: string;
  dataType: "text" | "number";
}

export interface SalesAnalysisExportPayload {
  date: string;
  report: SalesAnalysisReport;
  format: SalesAnalysisExportFormat;
  columns: SalesAnalysisExportColumn[];
}

const getMimeType = (format: SalesAnalysisExportFormat): string => {
  switch (format) {
    case "excel":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    case "csv":
      return "text/csv";
    case "pdf":
      return "application/pdf";
    case "json":
      return "application/json";
    default:
      return "application/octet-stream";
  }
};

const getFileExtension = (format: SalesAnalysisExportFormat): string => {
  switch (format) {
    case "excel":
      return "xlsx";
    case "csv":
      return "csv";
    case "pdf":
      return "pdf";
    case "json":
      return "json";
    default:
      return "txt";
  }
};

export const useSalesAnalysisExportMutation = () => {
  const { axiosInstance } = useBaseRequestService({ useToken: true, tokenType: "accessToken" });

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: SalesAnalysisExportPayload) => {
      const response = await axiosInstance.post("/sales/analysis/export", payload, {
        responseType: "blob"
      });
      return { response, payload };
    },
    onSuccess: ({ response, payload }) => {
      const blob = new Blob([response.data], { type: getMimeType(payload.format) });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `sales_by_${payload.report}_export_${new Date().toISOString().split("T")[0]}.${getFileExtension(
        payload.format
      )}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    onError(error) {
      toast.error("Error", { description: getErrorMessageFromApi(error) });
    }
  });

  return { mutate, isPending };
};
