"use client"; // اضافه کردن این خط

import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { useAuth } from "@/context/AuthContext"; 
import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/header.module.css";
import ConfirmDialog from "./utils/ConfirmDialog";

export default function Header() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { authStatus, logout } = useAuth(); 
  const router = useRouter(); 
  const [iconSrc, setIconSrc] = useState({
    question: "/images/question.svg",
    exit: "/images/exit.svg",
    profile: "/images/profile.svg",
    login: "/images/login.svg",
    home: "/images/home.svg",
    bazar: "/images/bazar.svg",
    create: "/images/create.svg",
    category: "/images/category.svg",
    law: "/images/law.svg",
  });

  const handleMouseEnter = (icon) => {
    setIconSrc((prevState) => ({
      ...prevState,
      [icon]: `/images/${icon}_hover.svg`,
    }));
  };

  const handleMouseLeave = (icon) => {
    setIconSrc((prevState) => ({
      ...prevState,
      [icon]: `/images/${icon}.svg`,
    }));
  };

  const handleLogoutClick = () => {
    setIsDialogOpen(true); 
  };

  const handleConfirmLogout = async () => {
    try {
      await logout(); 
      router.push("/"); 
    } catch (error) {
      console.error("Error during logout:", error);
      alert("خطا در خروج. لطفاً دوباره امتحان کنید.");
    } finally {
      setIsDialogOpen(false); 
    }
  };

  const handleCancelLogout = () => {
    setIsDialogOpen(false); 
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.navbar_wrapper}>
          <nav className={styles.navbar_container}>
            <Image
              src="/images/logo.svg"
              alt="ربو | بورس خرما"
              className={styles.logo}
              width={70}
              height={70}
            />

            <div className={styles.left_menu}>
              <div
                className={styles.tooltip_container}
                onMouseEnter={() => handleMouseEnter("home")}
                onMouseLeave={() => handleMouseLeave("home")}
              >
                <Link href="/">
                  <Image
                    src={iconSrc.home}
                    alt=" خانه"
                    className={`${styles.icon} ${styles.icon_question}`}
                    width={24}
                    height={24}
                  />
                  <span className={styles.nav_title}>خانه</span>
                </Link>
              </div>

              <div
                className={styles.tooltip_container}
                onMouseEnter={() => handleMouseEnter("category")}
                onMouseLeave={() => handleMouseLeave("category")}
              >
                <Link href="/bazar">
                  <Image
                    src={iconSrc.category}
                    alt=" بازار "
                    className={`${styles.icon} ${styles.icon_question}`}
                    width={34}
                    height={34}
                  />
                  <span className={styles.nav_title}>بازار</span>
                </Link>
              </div>

              <div
                className={styles.tooltip_container}
                onMouseEnter={() => handleMouseEnter("create")}
                onMouseLeave={() => handleMouseLeave("create")}
              >
                <Link href="/create">
                  <Image
                    src={iconSrc.create}
                    alt="ایجاد "
                    className={`${styles.icon} ${styles.icon_question}`}
                    width={34}
                    height={34}
                  />
                  <span className={styles.nav_title}>ایجاد</span>
                </Link>
              </div>

              <div
                className={styles.tooltip_container}
                onMouseEnter={() => handleMouseEnter("profile")}
                onMouseLeave={() => handleMouseLeave("profile")}
              >
                <Link href="/profile">
                  <Image
                    src={iconSrc.profile}
                    alt="پروفایل"
                    className={`${styles.icon} ${styles.icon_profile}`}
                    width={34}
                    height={34}
                  />
                  <span className={styles.nav_title}>پروفایل</span>
                </Link>
              </div>

              {/* دکمه خروج */}
              {authStatus && (
                <div
                  className={styles.tooltip_container}
                  onMouseEnter={() => handleMouseEnter("exit")}
                  onMouseLeave={() => handleMouseLeave("exit")}
                  onClick={handleLogoutClick} // فراخوانی دیالوگ خروج
                >
                  <Image
                    src={iconSrc.exit}
                    alt="خروج"
                    className={`${styles.icon} ${styles.icon_exit}`}
                    width={34}
                    height={34}
                  />
                  <span className={styles.nav_title}>خروج</span>
                </div>
              )}

              {!authStatus && (
                <div
                  className={styles.tooltip_container}
                  onMouseEnter={() => handleMouseEnter("login")}
                  onMouseLeave={() => handleMouseLeave("login")}
                >
                  <Link href="/login">
                    <Image
                      src={iconSrc.login}
                      alt=" ورود"
                      className={`${styles.icon} ${styles.icon_question}`}
                      width={24}
                      height={24}
                    />
                    <span className={styles.nav_title}>ورود</span>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* نمایش دیالوگ تایید خروج */}
      {isDialogOpen && (
        <ConfirmDialog
          message="آیا مطمئن هستید که می‌خواهید خارج شوید؟"
          onConfirm={handleConfirmLogout}
          onCancel={handleCancelLogout}
          isOpen={isDialogOpen}
        />
      )}
    </>
  );
}
