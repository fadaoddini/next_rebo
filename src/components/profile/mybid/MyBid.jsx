import Image from "next/image";
import Link from "next/link";
import styles from "./MyBid.module.css";
import formatNumber from "@/components/utils/FormatNumber/formatNumber";
import CountdownTimer from "@/components/utils/timer/CountdownTimer";

const MyBid = ({
  color,
  url,
  title,
  description,
  price,
  myprice,
  top_price_bid,
  weight,
  packaging,
  imageSrc,
  finished_time,
  rank,
}) => {
  // تعیین کلاس بر اساس مقدار color
  const cardClassName = color === "buy" ? styles.buyCard : styles.sellCard;

  return (
    <Link href={url}>
      <div
        className={`${styles.card} ${cardClassName}`}
        style={{
          cursor: "pointer",
        }}
      >
        {/* تصویر محصول */}
        <div className={styles.imageContainer}>
          <img
            src={imageSrc}
            alt={title}
            width={100}
            height={100}
            className={styles.image}
          />
          {color === "buy" ? (
            <img
              className={styles.label_img}
              src="/images/label_buy.svg"
              alt="buy"
            />
          ) : (
            <img
              className={styles.label_img}
              src="/images/label_sell.svg"
              alt="sell"
            />
          )}
        </div>

        {/* اطلاعات محصول */}
        <div className={styles.info}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.offer}>
            بالاترین پیشنهاد:{" "}
            <span className={styles.green}>{formatNumber(top_price_bid)}</span>
            تومان
          </p>
      
          <div className={styles.details}>
            <p className={styles.detail}>
              <span className={styles.icon}>💰</span>
              <span className={styles.attr}>قیمت :</span>
              <span className={styles.bold}>{formatNumber(price)}</span> تومان
            </p>
            <p className={styles.detail}>
              <span className={styles.icon}>📦</span>
              <span className={styles.attr}>بسته‌بندی :</span>
              {packaging}
            </p>
            <p className={styles.detail}>
              <span className={styles.icon}>⚖️</span>
              <span className={styles.attr}>وزن :</span>
              <span className={styles.bold}>{formatNumber(weight)}</span>{" "}
              کیلوگرم
            </p>
          </div>
        </div>
        <div className={styles.timerContainer}>
          <div className={styles.timerLeft}>
           <span className={styles.span_rank}>
           رتبه شما : 
           
           {formatNumber(rank)}
           </span>

            <div className={styles.timerIcon}>
              <span>
              پیشنهاد شما : 
               
              {formatNumber(myprice)}
              تومان
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MyBid;
