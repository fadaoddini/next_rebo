"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Config from "@/config/config";
import Link from "next/link";
import styles from "@/styles/category.module.css";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Category() {
  const searchParams = useSearchParams();
  const [color, setColor] = useState(null);
  const { user, isAuthenticated, logout, loading } = useAuth();

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setColor(searchParams.get("color"));
  }, [searchParams]);

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
      ? `${styles.circleContainerGreen}`
      : `${styles.circleContainerRed}`;
  const titleClass =
    color === "buy" ? `${styles.titleGreen}` : `${styles.titleRed}`;

  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated) {
        try {
          const token = localStorage.getItem("accessToken");
          const response = await axios.get(
            Config.getApiUrl("catalogue", "all_type_web"),
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setCategories(response.data);
        } catch (error) {
          console.error("Error fetching data:", error);
          
        }
      }
    };

    fetchData();
  }, [isAuthenticated]);

  if (loading) return <div>در حال بارگذاری...</div>;

  return (
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
  );
}
