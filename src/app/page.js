"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import Config from "@/config/config"; 
import ProductCard from "@/components/bazar/items/ProductCard";
import styles from "@/styles/home.module.css";
import Search from '@/components/bazar/search/Search';

export default function Home() {
  const [products, setProducts] = useState([]); // همه محصولات
  const [filteredProducts, setFilteredProducts] = useState([]); // محصولات فیلتر شده
  const [fetching, setFetching] = useState(false); // وضعیت در حال دریافت محصولات
  const [error, setError] = useState(null); // ذخیره خطاها
  const [query, setQuery] = useState(""); // جستجوی کاربر

  // دریافت محصولات از سرور
  const fetchProducts = async () => {
    setFetching(true);
    setError(null); // ریست خطاها
  
    try {
      const response = await axios.get(
        Config.getApiUrl("catalogue", "bazar/bazar_all")
      );
      setProducts(response.data);
      setFilteredProducts(response.data); // محصولات اولیه را در فیلتر هم ذخیره کنید
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error);
    } finally {
      setFetching(false);
    }
  };

  // اعمال فیلتر به محصولات در زمان تغییر ورودی جستجو
  useEffect(() => {
    if (query.trim() === "") {
      setFilteredProducts(products); // اگر جستجو خالی باشد، همه محصولات نمایش داده شوند
    } else {
      const lowerCaseQuery = query.toLowerCase();
      const filtered = products.filter((product) =>
        product.name_type.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredProducts(filtered); // بروزرسانی لیست فیلتر شده
    }
  }, [query, products]);

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.left}>
          {/* انتقال query و setter به کامپوننت جستجو */}
          <Search query={query} setQuery={setQuery} />

          <div>
            <h1 className={styles.titleRed}>
              <img
                src="/images/right_barg_red.png"
                alt="Left"
                className={styles.sideImage}
              />
              فروشندگان انواع خرما
              <img
                src="/images/left_barg_red.png"
                alt="Right"
                className={styles.sideImage}
              />
            </h1>
          </div>

          <div className={styles.gridContainer}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  color="sell"
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
                  url={`/product/${product.id}?color=sell`}
                />
              ))
            ) : (
              <div>هیچ محصولی یافت نشد.</div>
            )}
          </div>
        </div>
      </main>
     
    </div>
  );
}
