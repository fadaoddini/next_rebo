"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import useCheckToken from 'hook/useCheckToken';
import Cookies from 'js-cookie';
import axios from 'axios';
import Config from 'config/config';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const isLoggedIn = useCheckToken();
  const [authStatus, setAuthStatus] = useState(isLoggedIn);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAuthStatus(isLoggedIn);
    setLoading(false);
  }, [isLoggedIn]);

  const logout = async () => {
    try {
      const csrfToken = Cookies.get("csrftoken");
      const response = await axios.post(
        Config.getApiUrl("login", "logout"),
        {},
        {
          headers: {
            'X-CSRFToken': csrfToken,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        setAuthStatus(false);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ authStatus, setAuthStatus, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
