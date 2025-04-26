import { toast } from "sonner";
import { useBaseRequestService } from "./useAxiosPrivate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getErrorMessageFromApi } from "@/utils";
import { BaseResponse } from "@/helpers/baseResponse";

export const useGeneralMutation = <T>(mutationData: {
  mutationKey: string[];
  url: string;
  httpMethod: "put" | "patch" | "delete" | "post";
  requireAuth?: boolean;
}) => {
  const { mutationKey, url, httpMethod, requireAuth = true } = mutationData;
  const queryClient = useQueryClient();
  const { axiosInstance } = useBaseRequestService({ useToken: requireAuth, tokenType: "accessToken" });

  const { data, isPending, mutate } = useMutation({
    mutationFn: async (data: { payload: T }) => {
      const { payload = null } = data;
      return await axiosInstance[httpMethod]<BaseResponse<T>>(url, payload);
    },
    mutationKey,
    onError(error) {
      toast.error("Error", { description: getErrorMessageFromApi(error) });
    },
    onMutate() {
      queryClient.invalidateQueries({ queryKey: mutationKey });
    }
  });

  return { data, isPending, mutate };
};
