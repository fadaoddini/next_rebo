import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Config from "config/config";

const useCheckToken = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const refreshToken = Cookies.get("refreshToken");
      const csrfToken = Cookies.get("csrftoken");

      if (refreshToken) {
        try {
          const refreshResponse = await axios.post(
            Config.getApiUrl("login", "refreshToken"),
            { refresh: refreshToken },
            {
              withCredentials: true,
              headers: {
                'X-CSRFToken': csrfToken,
              },
            }
          );

          if (refreshResponse.status === 200) {
            console.log("توکن جدید دریافت شد");
            setIsLoggedIn(true);
          } else {
            console.log("نوسازی توکن موفقیت‌آمیز نبود");
            setIsLoggedIn(false);
          }
        } catch (refreshError) {
          console.error("خطا در نوسازی توکن:", refreshError);
          setIsLoggedIn(false);
        }
      } else {
        console.log("refreshToken وجود ندارد، هدایت به صفحه ورود");
        setIsLoggedIn(false);
      }
    };

    checkToken();
  }, []);

  return isLoggedIn;
};

export default useCheckToken;
