import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

import api from "./authClient";

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("useAuth must be within a AuthProvider");
  }

  return authContext;
};

const authProvider = ({ children }) => {
  const [token, setToken] = useState();

  useEffect(() => {
    const fetchMe = async () => {
      try {
        // const response = await.api.get('api/me');
        // setToken(response.data.accessToken);
      } catch {
        setToken(null);
      }
    };
  }, []);

  useLayoutEffect(() => {
    const authInterceptor = api.interceptors.request.use((config) => {
      config.headers.Authorization =
        !config._retry && token
          ? `Bearer ${token}`
          : config.headers.Authorization;
      return config;
    });
    return () => {
      api.interceptors.request.eject(authInterceptor);
    };
  }, [token]);
};

export default authProvider;
