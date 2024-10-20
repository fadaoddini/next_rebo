import styles from './profile.module.css'; // ایمپورت CSS Modules مخصوص صفحه پروفایل

export default function Profile() {
  return (
    <div>
      <h1 className={styles.profileHeader}>پروفایل کاربری</h1>
      <div className={styles.profileContent}>
        <p>محتوای پروفایل...</p>
      </div>
    </div>
  );
}