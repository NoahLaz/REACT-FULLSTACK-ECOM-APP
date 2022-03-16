import "./featuredInfo.css";
import { ArrowDownward, ArrowUpward } from "@material-ui/icons";
import { useEffect, useState } from "react";
import { userRequest } from "../../requestMethods";

export default function FeaturedInfo() {
  const [orderStats, setOrderStats] = useState([]);
  const [perc, setPerc] = useState(0);
  const [sales, setSales] = useState(0);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await userRequest.get("/orders/stats");
        const lastMonth = res.data[1].total;
        setOrderStats(res.data);
        setPerc(
          Math.floor((res.data[1].total / res.data[0].total) * 100) - 100
        );
        setSales((lastMonth - lastMonth * 0.7).toFixed(2));
      } catch (error) {}
    };
    getOrders();
  }, []);

  return (
    <div className="featured">
      <div className="featuredItem">
        <span className="featuredTitle">Revenue</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">${sales}</span>
          <span className="featuredMoneyRate">
            %{perc}{" "}
            {perc < 0 ? (
              <ArrowDownward className="featuredIcon negative" />
            ) : (
              <ArrowUpward className="featuredIcon" />
            )}
          </span>
        </div>
        <span className="featuredSub">Compared to last month</span>
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">Sales</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">${orderStats[1]?.total}</span>
          <span className="featuredMoneyRate">
            %{perc}{" "}
            {perc < 0 ? (
              <ArrowDownward className="featuredIcon negative" />
            ) : (
              <ArrowUpward className="featuredIcon" />
            )}
          </span>
        </div>
        <span className="featuredSub">Compared to last month</span>
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">Cost</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">$2,225</span>
          <span className="featuredMoneyRate">
            +2.4 <ArrowUpward className="featuredIcon" />
          </span>
        </div>
        <span className="featuredSub">Compared to last month</span>
      </div>
    </div>
  );
}
