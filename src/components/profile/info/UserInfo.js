import React from "react";
import styles from "./UserInfo.module.css";

const UserInfo = ({ onEdit, onSuggestions, onAds, onSaved, onLogout }) => {
  return (
    <div className={styles.container}>
      <div className={styles.item} onClick={onEdit}>
        <div className={styles.icon}>📝</div>
        <span className={styles.span2}>ویرایش اطلاعات فردی</span>
      </div>

      <div className={styles.item} onClick={onSuggestions}>
        <div className={styles.icon}>💡</div>
        <span className={styles.span2}>پیشنهادات من</span>
      </div>

      <div className={styles.item} onClick={onAds}>
        <div className={styles.icon}>📢</div>
        <span className={styles.span2}>آگهی های من</span>
      </div>

      <div className={styles.item} onClick={onSaved}>
        <div className={styles.icon}>🔖</div>
        <span className={styles.span2}>ذخیره شده ها</span>
      </div>

      <div className={styles.item} onClick={onLogout}>
        <div className={styles.icon}>🚪</div>
        <span className={styles.span2}>خروج از حساب کاربری</span>
      </div>
    </div>
  );
};

export default UserInfo;
