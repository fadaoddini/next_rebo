"use client"; // اضافه کردن این خط

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/header.module.css";

export default function Header() {
  const [iconSrc, setIconSrc] = useState({
    question: "/images/question.png",
    exit: "/images/exit.png",
    profile: "/images/profile.png",

  });

  const handleMouseEnter = (icon) => {
    setIconSrc((prevState) => ({
      ...prevState,
      [icon]: `/images/${icon}_hover.png`,
    }));
  };

  const handleMouseLeave = (icon) => {
    setIconSrc((prevState) => ({
      ...prevState,
      [icon]: `/images/${icon}.png`,
    }));
  };

  return (
    <header className={styles.header}>
      <div className={styles.navbar_wrapper}>
        <nav className={styles.navbar_container}>
          <Image
            src="/images/logo.png"
            alt="ربو | بورس خرما"
            className={styles.logo}
            width={70}
            height={70}
          />

          <ul className={styles.nav_list}>
            <li className={styles.nav_item}>
              <Link href="/" className={styles.nav_link}>
                خانه
              </Link>
            </li>
            <li className={styles.nav_item}>
              <Link href="/bazar" className={styles.nav_link}>
                بازار عمده
              </Link>
            </li>
            <li className={styles.nav_item}>
              <Link href="/profile" className={styles.nav_link}>
                پروفایل
              </Link>
            </li>
            <li className={styles.nav_item}>
              <Link href="/product" className={styles.nav_link}>
                محصول
              </Link>
            </li>
            <li className={styles.nav_item}>
              <Link href="/category" className={styles.nav_link}>
                دسته بندی
              </Link>
            </li>
            <li className={styles.nav_item}>
              <Link href="/law" className={styles.nav_link}>
                قوانین
              </Link>
            </li>
          </ul>

          <div className={styles.left_menu}>
            <div className={styles.tooltip_container}>
              <Link href="/faq">
                <Image
                  src={iconSrc.question}
                  alt="سوالات متداول"
                  className={`${styles.icon} ${styles.icon_question}`}
                  width={34}
                  height={34}
                  onMouseEnter={() => handleMouseEnter("question")}
                  onMouseLeave={() => handleMouseLeave("question")}
                />
                <div className={styles.tooltip}>سوالات متداول</div>
              </Link>
            </div>
            <div className={styles.tooltip_container}>
              <Link href="/profile">
                <Image
                  src={iconSrc.profile}
                  alt="پروفایل"
                  className={`${styles.icon} ${styles.icon_profile}`}
                  width={34}
                  height={34}
                  onMouseEnter={() => handleMouseEnter("profile")}
                  onMouseLeave={() => handleMouseLeave("profile")}
                />
                <div className={styles.tooltip}>پروفایل</div>
              </Link>
            </div>
            <div className={styles.tooltip_container}>
              <Image
                src={iconSrc.exit}
                alt="خروج"
                className={`${styles.icon} ${styles.icon_exit}`}
                width={34}
                height={34}
                onMouseEnter={() => handleMouseEnter("exit")}
                onMouseLeave={() => handleMouseLeave("exit")}
              />
              <div className={styles.tooltip}>خروج</div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
