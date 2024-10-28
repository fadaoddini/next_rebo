"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Config from "@/config/config";
import SingleCard from "@/components/bazar/Single/SingleCard";
import PriceList from "@/components/bazar/Single/PriceList";
import AddBid from "@/components/bazar/Bid/AddBid";
import ProposerCard from "@/components/bazar/ProposerCard/ProposerCard";

import UserCard from "@/components/profile/user/UserCard";
import styles from "@/styles/styleBuySingle.module.css";
import SingleApp from "@/components/bazar/Single/SingleApp";
import SectionInfoSingle from "@/components/bazar/Single/SectionInfoSingle";
import TopBider from "@/components/bazar/Bid/TopBider";

export default function Product({ params }) {
  const searchParams = useSearchParams();
  const color = searchParams.get("color");
  const { id } = params;
  const cardClassName = color === "buy" ? styles.buy : styles.sell;
  const [singleData, setSingleData] = useState(null);
  const [listBids, setListBids] = useState([]);
  const [bidData, setBidData] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // بارگذاری اطلاعات کاربر و احراز هویت
  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const response = await axios.get(Config.getApiUrl("login", `getInfo`), {
          withCredentials: true,
        });
        setUserInfo(response.data.user);
        setIsAuthenticated(true); // کاربر احراز هویت شده است
      } catch (error) {
        console.error("Error fetching user info:", error);
        setIsAuthenticated(false); // کاربر احراز هویت نشده است
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []); // این بارگذاری فقط یکبار در ابتدای بارگذاری کامپوننت انجام می‌شود

  // بارگذاری اطلاعات محصول
  useEffect(() => {
    const fetchSingle = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await axios.get(
          Config.getApiUrl("catalogue", `${color}/single/${id}`),
          { withCredentials: true }
        );
        setSingleData(response.data);
        
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSingle();
  }, [id]);

  // بارگذاری اطلاعات بیدها
  useEffect(() => {
    const fetchListBids = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await axios.get(
          Config.getApiUrl("catalogue", `${color}/bid/list/${id}/`),
          { withCredentials: true }
        );
        setListBids(response.data);
        const newItems = response.data.map((bid) => ({
          price: bid.price,
          quantity: bid.weight,
          total: bid.total,
        }));
        setItems(newItems);
      } catch (error) {
        console.error("Error fetching bids:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchListBids();
  }, [id, color]);

  const fetchBid = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await axios.get(
        Config.getApiUrl("catalogue", `${color}/bid/${id}/`),
        { withCredentials: true }
      );
      setBidData(response.data);
    } catch (error) {
      console.error("Error fetching bids:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // بارگذاری اطلاعات بیدها
  useEffect(() => {
    fetchBid();
  }, [id]);

  // بارگذاری مجدد لیست بیدها
  // بارگذاری مجدد لیست بیدها
  const refreshBidList = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await axios.get(
        Config.getApiUrl("catalogue", `${color}/bid/list/${id}/`),
        { withCredentials: true }
      );
      setListBids(response.data); // بروزرسانی لیست بیدها
      const newItems = response.data.map((bid) => ({
        price: bid.price,
        quantity: bid.weight,
        total: bid.total,
      }));
      setItems(newItems); // بروزرسانی آیتم‌ها

      // همچنین می‌توانید اطلاعات بیدها را به‌روز کنید
      await fetchBid(); // اطلاعات بیدها را دوباره بارگذاری کنید
    } catch (error) {
      console.error("Error fetching bids:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>در حال بارگذاری...</p>;
  if (error) return <p>خطا در بارگذاری داده‌ها</p>;
  if (!singleData) return null;

  const images =
    singleData?.images?.map((image) => `${Config.baseUrl}${image.image}`) || [];
  const attributes = singleData.attrs || [];

  return (
    <div className={`${styles.container} ${styles[color]}`}>
      <div className={styles.layout}>
        <div className={styles.right}>
          <SingleApp
            color={color}
            images={images}
            description={singleData.description}
            weight={singleData.weight}
            price={singleData.price}
            top_price_bid={singleData.top_price_bid}
            count_bid={singleData.count_bid}
            warranty={singleData.warranty}
            lable={singleData.lable}
            name={singleData.name}
            user={singleData.user}
            expireTime={singleData.expire_time}
            attrs={attributes}
          />

          <PriceList
            items={items}
            color={color === "sell" ? "buy" : "sell"}
            lable={singleData.lable}
          />
        </div>
        <div className={styles.main}>
          <div className={styles.titr}>
            <span>
              {color === "buy" ? " آگهی خرید " : " آگهی فروش "}
              {singleData.name} {singleData.lable}
            </span>
            <span>
              <img
                className={styles.favorit}
                src="/images/favorit.svg"
                alt={singleData.name}
              />
            </span>
          </div>

          <div className={styles.info_product}>
            <SectionInfoSingle
              color={color}
              price={singleData.top_price_bid}
              img="/images/price_bid_icon.svg"
              title="قیمت پیشنهادی"
              vahed="تومان"
            />
            <SectionInfoSingle
              color={color}
              price={singleData.weight}
              img="/images/weight_icon.svg"
              title="وزن"
              vahed="کیلوگرم"
            />
            <SectionInfoSingle
              color={color}
              price={
                attributes.find((attributes) => attributes.attr === "بسته بندی")
                  ?.value || "نامشخص"
              }
              img="/images/package_icon.svg"
              title="بسته بندی  "
              vahed=""
            />
          </div>

          <div className={styles.description}>{singleData.description}</div>

          <div className={styles.top_bider}>
            <TopBider bids={bidData} color={color} />
          </div>
        </div>
        <div className={styles.left}>
          {isAuthenticated && (
            <>
              <UserCard
                imageUrl={`${Config.baseUrl}${singleData.user.image}`}
                name={`${singleData.user.first_name} ${singleData.user.last_name}`}
                mobile={singleData.user.mobile}
                userId={singleData.user.id}
                userIdViewer={userInfo.id}
                productCount={singleData.user.product_count}
              />
              {isAuthenticated && userInfo.id !== singleData.user.id && (
                <div className={styles.bider_right}>
                  <AddBid
                    productId={id}
                    name={singleData.name}
                    lable={singleData.lable}
                    top_price_bid={singleData.top_price_bid}
                    onBidSubmitted={refreshBidList}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
