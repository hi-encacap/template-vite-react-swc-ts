import { HttpStatusCode, InternalAxiosRequestConfig, isAxiosError } from "axios";

import { authService } from "@services/index";

import { Axios } from "./axios/axios";

interface AxiosErrorHandler {
  onUnauthorized?: (error: unknown) => void;
}

const slugify = (text: string): string => {
  let result = text.toLowerCase();

  result = result.replace(/[àáạảãâầấậẩẫăằắặẳẵ]/gu, "a");
  result = result.replace(/[èéẹẻẽêềếệểễ]/gu, "e");
  result = result.replace(/[ìíịỉĩ]/gu, "i");
  result = result.replace(/[òóọỏõôồốộổỗơờớợởỡ]/gu, "o");
  result = result.replace(/[ùúụủũưừứựửữ]/gu, "u");
  result = result.replace(/[ỳýỵỷỹ]/gu, "y");
  result = result.replace(/(?<id>đ)/gu, "d");

  result = result.replace(/(?<id>[^0-9a-z-\s])/g, "");

  result = result.replace(/(?<id>\s+)/g, "-");

  result = result.replace(/^-+/g, "");

  result = result.replace(/^-+$/g, "");

  return result;
};

const beautyPrice = (price: number): string => {
  // eslint-disable-next-line sonarjs/slow-regex
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const normalizePrice = (price: string): number => {
  return parseFloat(price.replace(/,/g, ""));
};

const normalizeRequestConfig = (request: InternalAxiosRequestConfig) => {
  const { headers } = request;
  const params = request.params as Record<string, unknown> | undefined;

  const { accessToken } = authService.getTokens();

  if (accessToken) {
    headers.Authorization = `Bearer ${String(accessToken)}`;
  }

  if (params) {
    const { filters, pagination, sorter, ...newParams } = params;

    if (pagination) {
      newParams.page = pagination.current;
      newParams.limit = pagination.pageSize;
    }

    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (key.includes("[]")) {
          const newKey = key.replace("[]", "");

          newParams[newKey] = filters[key];
          return;
        }

        newParams[key] = filters[key].join(",");
      });
    }

    if (sorter && "field" in sorter && "order" in sorter) {
      const { field } = sorter;
      const sortOrderNumber = sorter.order === "ascend" ? 1 : -1;

      newParams.sortBy = `${field},${sortOrderNumber}`;
    }

    // Remove all empty string from newParams
    request.params = Object.keys(newParams).reduce<Record<string, string>>((acc, key) => {
      const value = newParams[key];

      if (value !== "") {
        acc[key] = value;
      }

      return acc;
    }, {});
  }

  return request;
};

const handleAxiosError = async (
  error: unknown,
  instance: Readonly<Axios>,
  { onUnauthorized }: AxiosErrorHandler,
) => {
  if (!isAxiosError(error)) {
    return Promise.reject(error);
  }

  const { response, config } = error;

  if (response && config) {
    const { status } = response;
    const autoRefreshToken = config.autoRefreshToken;

    if (status === HttpStatusCode.Unauthorized) {
      try {
        if (autoRefreshToken !== false) {
          const { refreshToken } = authService.getTokens();

          if (refreshToken) {
            const newTokens = await authService.refreshToken(refreshToken);

            authService.setTokens(newTokens.accessToken, newTokens.refreshToken);

            config.headers.Authorization = `Bearer ${newTokens.accessToken}`;
            config.autoRefreshToken = false;

            return instance.request(config);
          }
        }

        throw error;
      } catch (refreshTokenError) {
        return onUnauthorized?.(refreshTokenError);
      }
    }
  }

  return Promise.reject(error);
};

const getScreenSize = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  return {
    width,
    height,
  };
};

export { beautyPrice, getScreenSize, handleAxiosError, normalizePrice, normalizeRequestConfig, slugify };
