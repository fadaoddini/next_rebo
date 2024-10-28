import DesCardBazar2 from "@/components/bazar/DesCardBazar/DesCardBazar2";
import DesCardBazar3 from "@/components/bazar/DesCardBazar/DesCardBazar3";
import styles from "@/styles/styleBazar.module.css"; 

export default function Bazar() {
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
}