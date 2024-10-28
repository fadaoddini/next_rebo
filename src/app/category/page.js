"use client";

import { useEffect, useState, Suspense } from "react";
import axios from "axios";
import Config from "@/config/config";
import Link from "next/link";
import styles from "@/styles/category.module.css";
import { useSearchParams } from "next/navigation";
import useCheckToken from "@/hook/useCheckToken";

export default function Category() {
  const searchParams = useSearchParams();
  const color = searchParams.get("color");
  console.log("color", color);
  const textColor = color === "buy" ? "var(--dark-green)" : "var(--dark-red)";
  const leftBargImage =
    color === "buy"
      ? "/images/left_barg_green.svg"
      : "/images/left_barg_red.png";
  const rightBargImage =
    color === "buy"
      ? "/images/right_barg_green.svg"
      : "/images/right_barg_red.png";
  const circleClass =
    color === "buy"
      ? `${styles.circleContainerGreen} `
      : `${styles.circleContainerRed} `;
  const titleClass =
    color === "buy" ? `${styles.titleGreen} ` : `${styles.titleRed} `;

  // مدیریت داده‌های پویا
  const [categories, setCategories] = useState([]);
  const isLoggedIn = useCheckToken(); // استفاده از hook برای بررسی لاگین بودن

  // بارگذاری داده‌ها از API
  useEffect(() => {
    const fetchData = async () => {
      if (isLoggedIn) {
        try {
          const response = await axios.get(
            Config.getApiUrl("catalogue", "all_type_web"),
            {
              withCredentials: true,
            }
          );

          // ذخیره داده‌ها در state
          setCategories(response.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [isLoggedIn]); // اجرا فقط زمانی که isLoggedIn تغییر کند (توکن نوسازی شود)

  return (
    <Suspense fallback={<div>در حال بارگذاری...</div>}>
      <div className={styles.categoryContainer}>
        {categories.map((category) => (
          <div key={category.cat_id}>
            <h1 className={titleClass}>
              <img
                src={leftBargImage}
                alt="Left"
                className={styles.sideImage}
              />
              {category.category}
              <img
                src={rightBargImage}
                alt="Right"
                className={styles.sideImage}
              />
            </h1>

            <div className={styles.categoryList}>
              {category.types.map((type) => (
                <div key={type.id} className={styles.categoryItem}>
                  <Link href={`/products?type_id=${type.id}&color=${color}`}>
                    <div className={circleClass}>
                      <img
                        src={`${Config.baseUrl}${type.image}`}
                        alt={type.title}
                        className={styles.circleImage}
                      />
                      <div className={styles.circleTitle}>{type.title}</div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Suspense>
  );
}
