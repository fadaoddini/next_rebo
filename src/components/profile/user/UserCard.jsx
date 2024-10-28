import { useState, useEffect } from "react";
import axios from "axios";
import Config from "config/config";
import styles from "./UserCard.module.css"; // مطمئن شوید که استایل‌های مناسب را اضافه کنید

const UserCard = ({
  imageUrl: initialImageUrl,
  name,
  mobile,
  userId,
  userIdViewer,
  productCount,
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [imageUrl, setImageUrl] = useState(
    initialImageUrl || "/images/avatar.png"
  );
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const checkFollowingStatus = async () => {
    try {
      const response = await axios.get(
        Config.getApiUrl("login", `userDetails/${userId}/`),
        { withCredentials: true }
      );
      if (response.data) {
        setIsFollowing(response.data.isFollowing);
        setFollowersCount(response.data.followers);
        setFollowingCount(response.data.following);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    checkFollowingStatus();
  }, [userId]);

  const handleFollow = async () => {
    try {
      const response = await axios.post(
        Config.getApiUrl("login", "follow/"),
        { user_id: userId },
        { withCredentials: true }
      );
      if (response.status === 200 || response.status === 201) {
        setIsFollowing(true);
        setFollowersCount((prevCount) => prevCount + 1);
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const response = await axios.delete(
        Config.getApiUrl("login", "unfollow/"),
        {
          data: { user_id: userId },
          withCredentials: true,
        }
      );
      if (response.status === 200 || response.status === 204) {
        setIsFollowing(false);
        setFollowersCount((prevCount) => prevCount - 1);
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imagePreviewUrl = URL.createObjectURL(file);
      setImageUrl(imagePreviewUrl);

      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await axios.post(
          Config.getApiUrl("login", "setImageUser"),
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          console.log("Image uploaded successfully!");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.main_img}>
          <div className={styles.imageContainer}>
            <img src={imageUrl} alt="User" className={styles.image} />
          </div>
          {userId === userIdViewer && (
            <label className={styles.cameraIcon}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
              📷
            </label>
          )}
        </div>
        <div className={styles.name}>{name}</div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.badi}>{productCount}</span>
          <span>محصول</span>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.statItem}>
          <span className={styles.badi}>{followersCount}</span>
          <span>دنبال‌کننده ها</span>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.statItem}>
          <span className={styles.badi}>{followingCount}</span>
          <span>دنبال‌شده ها</span>
        </div>
      </div>

      <div className={styles.buttons}>
        {userId !== userIdViewer &&
          (isFollowing ? (
            <button className={styles.button_unfollow} onClick={handleUnfollow}>
              دنبال نکردن
            </button>
          ) : (
            <button className={styles.button_follow} onClick={handleFollow}>
              دنبال کردن
            </button>
          ))}

        <button className={styles.button_profile} onClick="/profile">
          مشاهده پروفایل
        </button>
      </div>
    </div>
  );
};

export default UserCard;
