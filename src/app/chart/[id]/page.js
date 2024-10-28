"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/context/AuthContext"; 
import Config from "@/config/config";
import styles from "@/styles/styleChart.module.css";
import DesChartBazar from "@/components/bazar/DesCardBazar/DesChartBazar";
import QueueList from "@/components/bazar/Queue/QueueList";
import MarketChart from "@/components/bazar/ChartCardBazar/MarketChart";

export default function Chart({ params }) {
  const { authStatus } = useAuth();
  const searchParams = useSearchParams();
  const { id } = params;
  const [chartData, setChartData] = useState([]);
  const [catName, setCatName] = useState({});
  const [sellQueue, setSellQueue] = useState([]);
  const [buyQueue, setBuyQueue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id || !authStatus) return; // بررسی اینکه id و authStatus وجود داشته باشند

    const fetchChart = async () => {
      setLoading(true);
      try {
        const url = Config.getApiUrl("catalogue", `chart/${id}/`);
        const response = await axios.get(url, { withCredentials: true });
        if (response.status === 200) {
          setChartData(response.data);
        } else {
          throw new Error("دریافت اطلاعات نمودار موفقیت‌آمیز نبود");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchName = async () => {
      try {
        const response = await axios.get(
          Config.getApiUrl("catalogue", `category/name/${id}/`)
        );
        if (response.status === 200) {
          setCatName(response.data);
        }
      } catch (error) {
        console.error("خطا در دریافت نام دسته‌بندی:", error);
      }
    };

    const fetchQueues = async () => {
      try {
        const sellResponse = await axios.get(
          Config.getApiUrl("catalogue", `buy/bid/list/chart/${id}/`)
        );
        const sellItems = sellResponse.data.map((bid) => ({
          price: bid.price,
          quantity: bid.weight,
          total: bid.total,
        }));
        setSellQueue(sellItems);

        const buyResponse = await axios.get(
          Config.getApiUrl("catalogue", `sell/bid/list/chart/${id}/`)
        );
        const buyItems = buyResponse.data.map((bid) => ({
          price: bid.price,
          quantity: bid.weight,
          total: bid.total,
        }));
        setBuyQueue(buyItems);
      } catch (error) {
        console.error("خطا در دریافت صف‌ها:", error);
      }
    };

    // فراخوانی توابع
    fetchChart();
    fetchName();
    fetchQueues();
  }, [id, authStatus]);

  const sanitizedChartData = chartData.map((item) => ({
    date: item?.date || "",
    maxPriceSell: item?.maxPriceSell === 0 ? null : item?.maxPriceSell,
    minPriceSell: item?.minPriceSell === 0 ? null : item?.minPriceSell,
    maxPriceBuy: item?.maxPriceBuy === 0 ? null : item?.maxPriceBuy,
    minPriceBuy: item?.minPriceBuy === 0 ? null : item?.minPriceBuy,
    volume: item?.volume === 0 ? null : item?.volume,
  }));

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <div className={styles.right}>
          <DesChartBazar
            imageSrc={`${Config.baseUrl}${catName?.image || ""}`}
            title={`${catName?.name || ""} ${catName?.title || ""}`}
            link="/"
            description={catName?.description || "بدون توضیح"}
          />
        </div>
        <div className={styles.main}>
          <div className={styles.headerSection}>
            {loading ? (
              <p>در حال بارگذاری...</p>
            ) : error ? (
              <p>خطا: {error}</p>
            ) : (
              <MarketChart data={sanitizedChartData} />
            )}
          </div>
          <div className={styles.gridContainer}>
            <QueueList
              items={sellQueue}
              color="sell"
              title="صف فروشندگان"
              catName={catName}
            />
            <QueueList
              items={buyQueue}
              color="buy"
              title="صف خریداران"
              catName={catName}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
