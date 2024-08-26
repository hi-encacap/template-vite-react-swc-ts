import Cookies from "universal-cookie";

import { AUTH } from "@constants/apiPath";
import { ILoginFormData, IToken, IUser } from "@interfaces/auth";
import { axios } from "@utils/index";

const setTokens = (accessToken: string, refreshToken: string) => {
  const cookieStore = new Cookies();

  cookieStore.set("token", accessToken, { path: "/" });
  cookieStore.set("refresh_token", refreshToken, { path: "/" });
};

const removeTokens = () => {
  const cookieStore = new Cookies();

  cookieStore.remove("token", { path: "/" });
  cookieStore.remove("refresh_token", { path: "/" });
};

const getMe = async () => {
  const { data } = await axios.get<IUser>(AUTH.ME);

  return data;
};

const login = async (credentials: ILoginFormData) => {
  const response = await axios.post<IToken & IUser>(AUTH.LOGIN, credentials);

  const { data } = response;
  const { accessToken, refreshToken, ...user } = data;

  setTokens(accessToken, refreshToken);

  return user;
};

const logout = () => {
  removeTokens();
};

const getAuthToken = () => {
  const cookieStore = new Cookies();

  return cookieStore.get<string>("token");
};

const getRefreshToken = () => {
  const cookieStore = new Cookies();

  return cookieStore.get<string>("refresh_token");
};

const getTokens = () => {
  return {
    accessToken: getAuthToken(),
    refreshToken: getRefreshToken(),
  };
};

const refreshToken = async (refreshToken: string) => {
  const response = await axios.post<IToken>(
    AUTH.REFRESH_TOKEN,
    { refreshToken },
    { autoRefreshToken: false },
  );

  return response.data;
};

export { getMe, getTokens, login, logout, refreshToken, removeTokens, setTokens };
