"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Config from "@/config/config";
import useCheckToken from "@/hook/useCheckToken";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, loading } = useCheckToken(); // بررسی وضعیت احراز هویت
  const [user, setUser] = useState(null); // اطلاعات کاربر

  // وقتی که بارگذاری تمام شد و وضعیت احراز هویت مشخص شد
  useEffect(() => {
    if (loading) return; // اگر هنوز بارگذاری ادامه دارد، هیچ عملی انجام ندهیم


   
    if (isAuthenticated) {
      // اگر کاربر احراز هویت شده است، داده‌های کاربر را فراخوانی می‌کنیم
      const fetchUserData = async () => {
        try {
          const accessToken = localStorage.getItem("accessToken");
          if (!accessToken) {
            console.log("Access token is missing");
            return;
          }

          const response = await axios.get(
            Config.getApiUrl("login", "profile/info"),
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          setUser(response.data); 
          console.log(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
    } else {
      // اگر کاربر احراز هویت نشده باشد، به صفحه لاگین هدایت می‌شود
      console.log("متاسفانه اطلاعات از سرور به دست ما نرسید");
    }
  }, [isAuthenticated, loading, router]);

  const login = async (mobile, code) => {
    try {
      const response = await axios.post(
        Config.getApiUrl("login", "verifyCode"),
        { mobile, code }
      );
      if (response.status === 200) {
        localStorage.setItem("accessToken", response.data.access_token);
        localStorage.setItem("refreshToken", response.data.refresh_token);
        setUser(response.data.user);
        router.push("/");
        window.location.reload();
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    router.push("/");
    window.location.reload();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
