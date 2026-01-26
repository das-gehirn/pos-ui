import { useMutation } from "@tanstack/react-query";

import { getErrorMessageFromApi } from "@/utils";
import { useBaseRequestService } from "./request/useAxiosPrivate";
import { toast } from "sonner";

interface ExportData {
  columns: Array<{
    source: string;
    destination: string;
    dataType: "text" | "number";
  }>;
  format: string;
  service: string;
}

export const useExportMutation = () => {
  const { axiosInstance } = useBaseRequestService({ useToken: true, tokenType: "accessToken" });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: { payload: ExportData }) => {
      const { payload } = data;
      const response = await axiosInstance.post("/exports", payload, {
        responseType: "blob"
      });
      return response;
    },
    onError(error) {
      toast.error("Error", { description: getErrorMessageFromApi(error) });
    }
  });

  return { mutate, isPending };
};
