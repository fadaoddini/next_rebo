"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Cookies from "js-cookie";
import Config from "@/config/config";
import Image from "next/image";
import styles from "@/styles/styleLogin.module.css";

const Login = () => {
  const { authStatus, setAuthStatus } = useAuth(); // وضعیت احراز هویت
  const [mobile, setMobile] = useState("");
  const [toast, setToast] = useState({ message: "", type: "" });
  const [waitTime, setWaitTime] = useState(0); // زمان انتظار
  const router = useRouter();
  useEffect(() => {
    console.log("authStatus in Verify:", authStatus); // بررسی وضعیت
    if (authStatus) {
      router.push("/");
    }
  }, [authStatus, router]);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");

    if (accessToken) {
      axios
        .get(Config.getApiUrl("login", "checkToken"), { withCredentials: true })
        .then((response) => {
          if (response.data.status === "success") {
            router.push("/");
          } else {
            handleInvalidToken();
          }
        })
        .catch((error) => {
          console.error("خطا در اعتبارسنجی توکن:", error);
          handleInvalidToken();
        });
    } else {
      router.push("/login");
    }
  }, []);

  const handleInvalidToken = () => {
    Cookies.remove("accessToken");
    router.push("/login");
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (toast.message) {
      setToast({ message: "", type: "" });
    }
    if (/^\d{0,9}$/.test(value)) {
      setMobile(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const mobileNumber = "09" + mobile;
    const mobileRegex = /^09\d{9}$/;

    if (!mobileRegex.test(mobileNumber)) {
      setToast({
        message: 'شماره موبایل باید در مجموع 11 رقم باشد.',
        type: "error",
      });
      return;
    }

    if (waitTime > 0) {
      setToast({
        message: `لطفاً ${waitTime} ثانیه دیگر منتظر بمانید.`,
        type: "error",
      });
      return;
    }

    try {
      const response = await axios.post(
        Config.getApiUrl("login", "sendOtp"),
        { mobile: mobileNumber },
        { headers: { "Content-Type": "application/json" } }
      );

      const { status, wait_time } = response.data; // زمان انتظار را از پاسخ دریافت می‌کنیم

      if (status === "ok") {
        setToast({
          message: `کد تأیید برای شماره ${mobileNumber} ارسال شد.`,
          type: "success",
        });
      
        // تغییر به استفاده از URL کامل به جای آبجکت
        router.push(`/verify?mobile=${mobileNumber}`);
      } else {
        setToast({
          message: "متأسفانه، ارسال کد تأیید ناموفق بود. لطفاً دوباره تلاش کنید.",
          type: "error",
        });
        setWaitTime(wait_time);
      }
    } catch (error) {
      console.error("Error:", error);
      setToast({
        message: "خطایی رخ داده است، لطفاً دوباره تلاش کنید.",
        type: "error",
      });
    }
  };

  // مدیریت تایمر انتظار
  useEffect(() => {
    let timer;
    if (waitTime > 0) {
      timer = setInterval(() => {
        setWaitTime((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [waitTime]);

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <div className={styles.main}>
          <div className={styles.form_wrapper}>
            <div className={styles.form_container}>
              <Image
                src="/images/logo_login.svg"
                alt="rebo"
                className={styles.logo}
                width={150}
                height={150}
              />
              <p className={styles.enter_text}>لطفا شماره موبایل خود را وارد کنید</p>
              <form onSubmit={handleSubmit}>
                <div className={styles.input_container}>
                  <span className={styles.fixed_text}>09</span>
                  <input
                    type="text"
                    value={mobile}
                    onChange={handleChange}
                    maxLength="9"
                    className={`${styles.input} ${
                      toast.message && !/^0[0-9]{9}$/.test("09" + mobile)
                        ? styles.input_error
                        : ""
                    }`}
                    placeholder="*******"
                  />
                </div>
                <button type="submit">ارسال کد تائید</button>
              </form>
              {toast.message && (
                <div
                  className={`${styles.toast} ${
                    toast.type === "error" ? styles.error : styles.success
                  }`}
                >
                  {toast.message}
                </div>
              )}
              {waitTime > 0 && (
                <div className={styles.wait_message}>
                  لطفاً تا {waitTime} ثانیه دیگر منتظر بمانید.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
