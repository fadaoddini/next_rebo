"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Config from "@/config/config"; // کانفیگ API شما
import ProductCard from "@/components/bazar/items/ProductCard";
import styles from "@/styles/products.module.css";

export default function Products() {
  const searchParams = useSearchParams();
  const color = searchParams.get("color");
  const typeId = searchParams.get("type_id");
  const cardClassName = color === "buy" ? styles.buyCard : styles.sellCard;
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          Config.getApiUrl("catalogue", "bazar/type_web"),
          {
            params: {
              type_id: typeId, // ارسال type_id به API
            },
            withCredentials: true,
          }
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    if (typeId) {
      fetchProducts();
    }
  }, [typeId]);

  return (
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
        {/* لیست محصولات نمایش داده می‌شود */}
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            color={color}
            title={product.name_type || "بدون عنوان"} // نمایش پیش‌فرض اگر title موجود نبود
            description={product.description || "توضیحاتی موجود نیست"}
            price={product.price || 0} // اگر قیمت موجود نبود، 0 نمایش داده شود
            top_price_bid={product.best_price_bid || 0} // مقدار درست برای بالاترین پیشنهاد قیمت
            upc={product.upc || ""} // فرض بر این است که فیلد `upc` در داده‌های شما موجود باشد
            weight={product.weight || 0} // وزن را از `weight` بگیرید
            packaging={
              product.attrs && product.attrs.length > 0
                ? product.attrs[0].value
                : "نوع بسته بندی نامشخص"
            } // نوع بسته‌بندی
            finished_time={product.expire_time || "نامشخص"} // زمان پایان، اگر `finished_time` نامشخص است
            imageSrc={
              product.images && product.images.length > 0
                ? `${Config.baseUrl}${product.images[0].image}`
                : "/images/no_pic.jpg" // تصویر پیش‌فرض
            }
            url={`/product/${product.id}?color=${color}`} // استفاده از پارامتر داینامیک در URL
          />
        ))}
      </div>
    </div>
  );
}
