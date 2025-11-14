import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Vip.css";

export default function VipInfo() {
  const nav = useNavigate();

  return (
    <div className="vip-container">
      <div className="vip-card">
        <h1 className="vip-title">✨ كن حرفياً مميزاً ✨</h1>

        <p className="vip-text">
          مع حساب VIP، تصبح في مقدمة نتائج البحث وتضاعف فرصك في الحصول على زبائن.
        </p>

        <h3>✔ مميزات VIP:</h3>
        <ul>
          <li>أولوية الظهور في البحث</li>
          <li>شارة ذهبية ⭐</li>
          <li>إشهار داخل التطبيق</li>
          <li>تقييم أعلى</li>
        </ul>

        <button
          className="vip-btn"
          onClick={() => nav("/vip-payment")}
        >
          ترقية حسابي الآن ⭐
        </button>
      </div>
    </div>
  );
}