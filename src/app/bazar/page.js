"use client";
import DesCardBazar2 from "@/components/bazar/DesCardBazar/DesCardBazar2";
import DesCardBazar3 from "@/components/bazar/DesCardBazar/DesCardBazar3";
import styles from "@/styles/styleBazar.module.css";
import { useAuth } from "@/context/AuthContext";


export default function Bazar() {
  const { user, isAuthenticated, logout, loading } = useAuth();

  if (loading) {
    return <div>در حال بارگذاری...</div>;
  }

  if (isAuthenticated) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>لطفا بازار مورد نظر را انتخاب کنید</h1>

        {/* صفحه اصلی با کارت‌ها */}
        <div className={styles.pageContent}>
          <DesCardBazar2
            href="/category"
            color="sell"
            coverImage="/images/frosh1.jpg"
            characterImage="/images/frosh1.png"
          />

          <DesCardBazar3
            href="/category"
            color="buy"
            coverImage="/images/kharid.jpg"
            characterImage="/images/kharid.png"
          />
        </div>

        <p className={styles.footer_title}>
          با انتخاب بازار مناسب راحت‌تر به هدفت دست پیدا کن
        </p>
      </div>
    );
  } else {
    return (
      <div className={styles.container}>
        <p>شما به این صفحه دسترسی ندارید لطفا ابتدا وارد سامانه شوید</p>
      </div>
    );
  }
}
