// src/components/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import bgImage from "../assets/bg.jpg"; // ضع صورة الخلفية هنا: src/assets/bg.jpg

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="overlay" />

      <div className="home-content">
        <h1 className="main-title">
          🔧 Artizone
          <span className="sub-main"> – التطبيق الأول للحرفيين في الجزائر</span>
        </h1>

        <p className="subtitle">حلول سريعة — حرفيون موثوقون</p>

        <div className="home-buttons">
          <button onClick={() => navigate("/register")}>تسجيل الحرفي</button>
          <button onClick={() => navigate("/search")}>البحث عن حرفي</button>
          <button onClick={() => navigate("/vip")}>كن مميزاً ⭐</button>
          <button onClick={() => navigate("/admin-login")}>لوحة الإدارة</button>
        </div>
      </div>
    </div>
  );
}