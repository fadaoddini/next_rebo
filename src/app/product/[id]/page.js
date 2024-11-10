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
import { useAuth } from "@/context/AuthContext";

export default function Product({ params }) {
  const { user, isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const color = searchParams.get("color");
  const { id } = params;

  const [singleData, setSingleData] = useState(null);
  const [listBids, setListBids] = useState([]);
  const [bidData, setBidData] = useState([]);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // دریافت توکن از localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // دریافت اطلاعات محصول و بیدها
  const fetchData = async () => {
    if (!id || !token) return;
    setLoading(true);
    try {
      const [productResponse, bidResponse, bidListResponse] = await Promise.all([
        axios.get(Config.getApiUrl("catalogue", `${color}/single/${id}`), {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(Config.getApiUrl("catalogue", `${color}/bid/${id}/`), {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(Config.getApiUrl("catalogue", `${color}/bid/list/${id}/`), {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setSingleData(productResponse.data);
      setBidData(bidResponse.data);

      const newItems = bidListResponse.data.map((bid) => ({
        price: bid.price,
        quantity: bid.weight,
        total: bid.total,
      }));
      setListBids(bidListResponse.data);
      setItems(newItems);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // بارگذاری اطلاعات پس از تنظیم token
  useEffect(() => {
    if (token && isAuthenticated) {
      fetchData();
    }
  }, [id, color, token, isAuthenticated]);

  if (loading) return <p>در حال بارگذاری...</p>;
  if (error) return <p>خطا در بارگذاری داده‌ها: {error.message}</p>;
  if (!singleData) return null;

  const images = singleData?.images?.map((image) => `${Config.baseUrl}${image.image}`) || [];
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
            <span>{color === "buy" ? " آگهی خرید " : " آگهی فروش "} {singleData.name}</span>
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
              price={attributes.find((attr) => attr.attr === "بسته بندی")?.value || "نامشخص"}
              img="/images/package_icon.svg"
              title="بسته بندی"
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
                userIdViewer={user?.id}
                productCount={singleData.user.product_count}
              />
              {user?.id !== singleData.user.id && (
                <div className={styles.bider_right}>
                  <AddBid
                    productId={id}
                    name={singleData.name}
                    lable={singleData.lable}
                    top_price_bid={singleData.top_price_bid}
                    onBidSubmitted={fetchData}
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
