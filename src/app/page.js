"use client";
import { useState } from 'react';
import styles from "@/styles/home.module.css";


const images = [
  '/images/001.jpg',
  '/images/002.jpg',
  '/images/003.jpg',
  '/images/004.jpg',
  '/images/005.jpg',
  '/images/006.jpg',
  '/images/007.jpg',
  '/images/008.jpg',
  '/images/009.jpg',
  '/images/010.jpg',
  '/images/011.jpg',
];


export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className={styles.container}>
      

      <div className={styles.infoSection}>
        <h1 className={styles.title}>ربو | بورس خرمای ایران </h1>
        <p className={styles.description}>

        ربو یک پلتفرم آنلاین تخصصی برای بازار عمده‌فروشی خرما است که با استفاده از هوش مصنوعی، واسطه‌ها را حذف کرده و تحلیل دقیقی از رفتار بازار ارائه می‌دهد. این نرم‌افزار به تولیدکنندگان و خریداران این امکان را می‌دهد تا به صورت مستقیم و کارآمدتر به معاملات بپردازند.

به زودی، امکانات منحصر به فردی مانند فروشگاه مرکزی خرما، سامانه انبارداری پیشرفته، مدیریت حقوق و دستمزد کارگاه‌های بسته‌بندی خرما، و دوره‌های آموزشی تخصصی به این پلتفرم اضافه خواهد شد. هدف ما ایجاد یک بازار هوشمند و بدون واسطه برای صنعت خرما است.







        
        </p>
        <div className={styles.buttons}>
          <a href='https://app.rebo.ir/static/app/Rebo-v1.apk' className={styles.marketBtn}>دانلود از بازار</a>
          <a href='https://app.rebo.ir/static/app/Rebo-v1.apk' className={styles.directBtn}>دانلود مستقیم</a>
        </div>
      </div>
      <div className={styles.sliderSection}>
        <div className={styles.phoneFrame}>
          <img src={images[currentIndex]} alt={`slide ${currentIndex}`} className={styles.slide} />
        </div>
        <div className={styles.sliderButtons}>
          <button onClick={handlePrev} className={styles.navButton}>
          <img src="/images/before.png" alt="rebo" className={styles.after} />
          </button>
          <button onClick={handleNext} className={styles.navButton}> 
            <img src="/images/after.png" alt="rebo" className={styles.after} />
            </button>
        </div>
      </div>
    </div>
  );
}
