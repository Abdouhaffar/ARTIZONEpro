import React, { useState, useMemo } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

import crafts from "../data/crafts-data.json";
import wilayasData from "../data/wilayas.json";
import "../styles/Form.css";

export default function RegisterArtisan() {
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [craft, setCraft] = useState("");
  const [otherCraft, setOtherCraft] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [daira, setDaira] = useState("");
  const [mobility, setMobility] = useState(false);
  const [available, setAvailable] = useState(true);
  const [loading, setLoading] = useState(false);

  // استخراج الولايات
  const wilayaList = useMemo(() => wilayasData.map(w => w.wilaya_name), []);

  // استخراج الدوائر حسب الولاية المختارة
  const dairaList = useMemo(() => {
    const found = wilayasData.find(w => w.wilaya_name === wilaya);
    return found ? found.dairas : [];
  }, [wilaya]);

  // عند الإرسال
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullname || !phone || !craft || !wilaya || !daira) {
      alert("⚠ الرجاء ملء جميع الحقول المطلوبة.");
      return;
    }

    const finalCraft = craft === "أخرى" ? otherCraft : craft;

    const payload = {
      name: fullname,
      phone,
      craft: finalCraft,
      wilaya,
      daira,
      mobility,
      available,
      createdAt: serverTimestamp(),
      vip: false,
      ratingCount: 0,
      ratingSum: 0,
    };

    try {
      setLoading(true);
      await addDoc(collection(db, "artisans"), payload);
      alert("✅ تم التسجيل بنجاح");

      setFullname("");
      setPhone("");
      setCraft("");
      setOtherCraft("");
      setWilaya("");
      setDaira("");
      setMobility(false);
      setAvailable(true);

    } catch (error) {
      alert("❌ حدث خطأ أثناء التسجيل");
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="form-container">
      <h2 className="form-title">تسجيل حرفي 🛠️</h2>

      <form onSubmit={handleSubmit} className="form-box">

        <label>الاسم الكامل</label>
        <input
          type="text"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          required
          placeholder="مثال: أحمد بن يوسف"
        />

        <label>رقم الهاتف</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          placeholder="07xxxxxxxx"
        />

        <label>نوع الحرفة</label>
        <select
          value={craft}
          onChange={(e) => setCraft(e.target.value)}
          required
        >
          <option value="">اختر الحرفة</option>
          {crafts.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>

        {craft === "أخرى" && (
          <>
            <label>اكتب حرفتك</label>
            <input
              type="text"
              value={otherCraft}
              onChange={(e) => setOtherCraft(e.target.value)}
              placeholder="مثال: مصلح طابلات"
            />
          </>
        )}

        <label>الولاية</label>
        <select
          value={wilaya}
          onChange={(e) => {
            setWilaya(e.target.value);
            setDaira("");
          }}
          required
        >
          <option value="">اختر الولاية</option>
          {wilayaList.map((w, i) => (
            <option key={i} value={w}>{w}</option>
          ))}
        </select>

        <label>الدائرة</label>
        <select
          value={daira}
          onChange={(e) => setDaira(e.target.value)}
          disabled={!wilaya}
          required
        >
          <option value="">اختر الدائرة</option>
          {dairaList.map((d, i) => (
            <option key={i} value={d}>{d}</option>
          ))}
        </select>

        <label style={{ marginTop: 10 }}>
          <input
            type="checkbox"
            checked={mobility}
            onChange={(e) => setMobility(e.target.checked)}
          /> يمكنه التنقل
        </label>

        <label>
          <input
            type="checkbox"
            checked={available}
            onChange={(e) => setAvailable(e.target.checked)}
          /> متاح الآن
        </label>

        <button className="submit-btn" type="submit" disabled={loading}>
          {loading ? "جار الإرسال..." : "تسجيل"}
        </button>
      </form>
    </div>
  );
}