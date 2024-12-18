"use client";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Config from "@/config/config"; 
import ProductCard from "@/components/bazar/items/ProductCard";
import styles from "@/styles/products.module.css";
import { useAuth } from "@/context/AuthContext";

export default function Products() {
  // استفاده از useAuth برای بررسی ورود کاربر
  const { user, isAuthenticated, loading, logout } = useAuth();
  const searchParams = useSearchParams();
  const [color, setColor] = useState(null);
  const [products, setProducts] = useState([]);
  const [typeId, setTypeId] = useState(null);
  const [fetching, setFetching] = useState(false); // وضعیت در حال دریافت محصولات
  const [error, setError] = useState(null); // ذخیره خطاها

  useEffect(() => {
    // تنظیم رنگ و type_id از URL
    setColor(searchParams.get("color"));
    setTypeId(searchParams.get("type_id"));
  }, [searchParams]);

  // دریافت محصولات از سرور
  const fetchProducts = async () => {
    if (!user || !typeId || !isAuthenticated) return;

    setFetching(true);
    setError(null); // ریست خطاها

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("توکن موجود نیست، هدایت به صفحه ورود");
        logout(); // خروج کاربر و پاک کردن اطلاعات توکن
        return;
      }

      const response = await axios.get(
        Config.getApiUrl("catalogue", "bazar/type_web"),
        {
          params: { type_id: typeId , sell_buy: color },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user, typeId, isAuthenticated]);

  const cardClassName = color === "buy" ? styles.buyCard : styles.sellCard;

  // مدیریت بارگذاری و خطاها
  if (loading || fetching) {
    return <div>در حال بارگذاری...</div>;
  }

  if (error) {
    return <div>خطا در دریافت محصولات: {error.message || "نامشخص"}</div>;
  }

  return (
    <Suspense fallback={<div>در حال بارگذاری...</div>}>
      <div className={styles.container}>
        <Link href={`/chart/${typeId}`}>
          <div className={`${styles.navbar} ${cardClassName}`}>
            <span className={`${styles.right_icon} ${cardClassName}`}>
              <img src="/images/right_icon.svg" alt="rebo" />
            </span>
            <span className={`${styles.left_icon} ${cardClassName}`}>
              <img src="/images/left_icon.svg" alt="rebo" />
            </span>
            <p className={`${styles.matn} ${cardClassName}`}>
              <span className={`${styles.arrow} ${cardClassName}`}>
                <img src="/images/arrow.svg" alt="rebo" />
              </span>
              <span className={`${styles.btn_click} ${cardClassName}`}>
                کلیک کنید
              </span>
              <span className={`${styles.icon} ${cardClassName}`}>
                <img src="/images/icon_static.svg" alt="rebo" />
              </span>
              <span className={`${styles.titr} ${cardClassName}`}>
                تحلیل بازار {products.length > 0 ? products[0].name_type : ""}
              </span>
            </p>
          </div>
        </Link>

        <div className={styles.gridContainer}>
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                color={color}
                title={product.name_type || "بدون عنوان"}
                description={product.description || "توضیحاتی موجود نیست"}
                price={product.price || 0}
                top_price_bid={product.best_price_bid || 0}
                upc={product.upc || ""}
                weight={product.weight || 0}
                packaging={
                  product.attrs && product.attrs.length > 0
                    ? product.attrs[0].value
                    : "نوع بسته بندی نامشخص"
                }
                finished_time={product.expire_time || "نامشخص"}
                imageSrc={
                  product.images && product.images.length > 0
                    ? `${Config.baseUrl}${product.images[0].image}`
                    : "/images/no_pic.jpg"
                }
                url={`/product/${product.id}?color=${color}`}
              />
            ))
          ) : (
            <div>هیچ محصولی یافت نشد.</div>
          )}
        </div>
      </div>
    </Suspense>
  );
}
