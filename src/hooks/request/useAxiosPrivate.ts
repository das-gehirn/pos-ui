import axios from "axios";
import { AuthUserResponse, InitData } from "@/interfaces/user";
import { BaseResponse } from "@/helpers/baseResponse";
import useAuthStore from "@/store/auth";
import useNotificationStore from "@/store/notification";

type TokenType = "accessToken";
interface RequestOptions {
  useToken: boolean;
  tokenType?: TokenType | null;
  contentType?: string;
  Accept?: string;
}

const { VITE_BASE_API_URL } = import.meta.env;

export const useBaseRequestService = (
  options: RequestOptions = {
    tokenType: "accessToken",
    useToken: false
  }
) => {
  const { saveAuthUser, authUser } = useAuthStore();
  const { setHasUnreadNotificationData } = useNotificationStore();
  const axiosInstance = axios.create({
    baseURL: VITE_BASE_API_URL,
    withCredentials: true
  });

  const { useToken, tokenType, contentType, Accept } = options;
  // check if request should use accessToken
  if (useToken && tokenType) {
    const accessTokenFromStore = authUser?.accessToken;
    // axios should attach access token to each request
    axiosInstance.interceptors.request.use(
      (config) => {
        config.headers["Content-Type"] = contentType;
        config.headers["Accept"] = Accept;
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${accessTokenFromStore}`;
        }
        return config;
      },
      (err) => Promise.reject(err)
    );

    // if response comes in and there is a 403 error, axios should fetch a new access token and retry the request again
    axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const response = await refreshToken();
          prevRequest.headers["Authorization"] = `Bearer ${response.accessToken}`;
          axiosInstance(prevRequest);
        }
        return Promise.reject(error);
      }
    );
  }

  const refreshToken = async () => {
    const { data } = await axiosInstance.get<BaseResponse<AuthUserResponse>>("/auth/refresh");
    saveAuthUser(data.response);

    return data.response;
  };
  const getAuth = async () => {
    const { data } = await axiosInstance.get<BaseResponse<AuthUserResponse>>("/auth");
    return data.response;
  };

  const getInitData = async () => {
    const { data } = await axiosInstance.get<BaseResponse<InitData>>("/init");
    setHasUnreadNotificationData(data.response.hasUnreadNotification);
  };

  return { axiosInstance, refreshToken, getAuth, getInitData };
};
