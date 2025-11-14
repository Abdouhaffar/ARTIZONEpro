// src/components/RegisterArtisan.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import crafts from "../data/crafts-data.json";
import wilayasData from "../data/wilayas.json"; // حسب ما حطيت الملف الجديد
import "../styles/Form.css";

export default function RegisterArtisan() {
  const navigate = useNavigate();
  const auth = getAuth();

  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [craft, setCraft] = useState("");
  const [otherCraft, setOtherCraft] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [daira, setDaira] = useState("");
  const [baladia, setBaladia] = useState("");
  const [mobility, setMobility] = useState(false);
  const [available, setAvailable] = useState(true);
  const [loading, setLoading] = useState(false);

  const wilayaList = useMemo(() => {
    return Array.from(new Set(wilayasData.map((i) => i.wilaya_name))).sort();
  }, []);

  const dairaList = useMemo(() => {
    if (!wilaya) return [];
    return Array.from(
      new Set(
        wilayasData
          .filter((i) => i.wilaya_name === wilaya)
          .map((i) => i.daira_name)
          .filter(Boolean)
      )
    ).sort();
  }, [wilaya]);

  const baladiaList = useMemo(() => {
    if (!daira) return [];
    return Array.from(
      new Set(
        wilayasData
          .filter((i) => i.daira_name === daira)
          .map((i) => i.commune_name)
          .filter(Boolean)
      )
    ).sort();
  }, [daira]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // basic validation
    if (!fullname || !phone || !craft || !wilaya || !daira || !baladia) {
      alert("رجاءً املأ جميع الحقول المطلوبة.");
      return;
    }

    if (!email || !password) {
      if (!window.confirm("لم تدخل بريداً وكلمة مرور. تسجيل الحساب مطلوب للدخول لاحقاً. تريد المتابعة بدون إنشاء حساب؟")) {
        return;
      }
    }

    setLoading(true);

    try {
      let uid = null;

      // إذا أعطاك المستخدم email/password -> إنشاء حساب Auth
      if (email && password) {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        uid = userCred.user.uid;
      }

      const finalCraft = craft === "أخرى" ? (otherCraft || "غير محددة") : craft;

      const payload = {
        name: fullname,
        phone: phone.toString(),
        email: email || null,
        uid: uid || null,
        craft: finalCraft,
        wilaya,
        daira,
        baladia,
        mobility: !!mobility,
        available: !!available,
        vip: false,
        images: [],
        createdAt: serverTimestamp(),
        ratingCount: 0,
        ratingSum: 0,
      };

      await addDoc(collection(db, "artisans"), payload);

      alert("✅ تم التسجيل بنجاح!");
      // بعد التسجيل نوجه المستخدم للـ login اذا أنشأ حساباً
      if (uid) {
        navigate("/login");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Register error:", err);
      alert("❌ حدث خطأ أثناء التسجيل: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">تسجيل الحرفي 🧰</h2>

      <form onSubmit={handleSubmit} className="form-box">
        <label>الاسم الكامل</label>
        <input type="text" value={fullname} onChange={(e) => setFullname(e.target.value)} placeholder="مثال: أحمد بن محمد" required />

        <label>رقم الهاتف</label>
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="مثال: 0550xxxxxx" required />

        <label>البريد الإلكتروني (للسجل والدخول)</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@mail.com" />

        <label>كلمة المرور</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="كلمة مرور (إن أردت إنشاء حساب)" />

        <label>نوع الحرفة</label>
        <select value={craft} onChange={(e) => setCraft(e.target.value)} required>
          <option value="">اختر الحرفة</option>
          {crafts.map((c, idx) => <option value={c} key={idx}>{c}</option>)}
        </select>

        {craft === "أخرى" && (
          <>
            <label>اكتب حرفتك</label>
            <input type="text" value={otherCraft} onChange={(e) => setOtherCraft(e.target.value)} placeholder="مثلاً: مصمم واجهات ..." required />
          </>
        )}

        <label>الولاية</label>
        <select value={wilaya} onChange={(e) => { setWilaya(e.target.value); setDaira(""); setBaladia(""); }} required>
          <option value="">اختر الولاية</option>
          {wilayaList.map((w, i) => <option value={w} key={i}>{w}</option>)}
        </select>

        <label>الدائرة</label>
        <select value={daira} onChange={(e) => { setDaira(e.target.value); setBaladia(""); }} required disabled={!wilaya}>
          <option value="">{wilaya ? "اختر الدائرة" : "اختر الولاية أولاً"}</option>
          {dairaList.map((d, i) => <option value={d} key={i}>{d}</option>)}
        </select>

        <label>البلدية</label>
        <select value={baladia} onChange={(e) => setBaladia(e.target.value)} required disabled={!daira}>
          <option value="">{daira ? "اختر البلدية" : "اختر الدائرة أولاً"}</option>
          {baladiaList.map((b, i) => <option value={b} key={i}>{b}</option>)}
        </select>

        <label style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
          <input type="checkbox" checked={mobility} onChange={(e) => setMobility(e.target.checked)} />
          يمكنني التنقل
        </label>

        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} />
          متاح الآن
        </label>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "جارٍ الإرسال..." : "تأكيد التسجيل"}
        </button>
      </form>
    </div>
  );
}