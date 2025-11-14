// src/components/RegisterArtisan.jsx
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import wilayasData from "../data/wilayas.json";

export default function RegisterArtisan() {
  const [name, setName] = useState("");
  const [profession, setProfession] = useState("");

  const [wilaya, setWilaya] = useState("");
  const [daira, setDaira] = useState("");
  const [commune, setCommune] = useState("");

  const [phone, setPhone] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [dairasList, setDairasList] = useState([]);
  const [communesList, setCommunesList] = useState([]);

  const [msg, setMsg] = useState("");

  // تحديث الدوائر عند اختيار ولاية
  useEffect(() => {
    if (!wilaya) return;

    const dairas = [
      ...new Set(
        wilayasData
          .filter((w) => w.wilaya_name === wilaya)
          .map((d) => d.daira_name)
      ),
    ];

    setDairasList(dairas);
    setCommune("");
    setCommunesList([]);
  }, [wilaya]);

  // تحديث البلديات عند اختيار دائرة
  useEffect(() => {
    if (!daira) return;

    const communes = wilayasData
      .filter((w) => w.daira_name === daira)
      .map((c) => c.commune_name);

    setCommunesList(communes);
  }, [daira]);

  const register = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await addDoc(collection(db, "artisans"), {
        uid: user.user.uid,
        name,
        profession,
        wilaya,
        daira,
        commune,
        phone,
        email,
        createdAt: new Date(),
      });

      setMsg("تم التسجيل بنجاح ✔");
    } catch (err) {
      console.error(err);
      setMsg("حدث خطأ أثناء التسجيل ❌");
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 20 }}>
      <h2>تسجيل الحرفي</h2>

      <form onSubmit={register}>
        
        <label>الاسم الكامل:</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>المهنة:</label>
        <input
          type="text"
          required
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
        />

        <label>الولاية:</label>
        <select
          required
          value={wilaya}
          onChange={(e) => setWilaya(e.target.value)}
        >
          <option value="">اختر الولاية</option>
          {[
            ...new Set(wilayasData.map((w) => w.wilaya_name)),
          ].map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>

        <label>الدائرة:</label>
        <select
          required
          value={daira}
          onChange={(e) => setDaira(e.target.value)}
        >
          <option value="">اختر الدائرة</option>
          {dairasList.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <label>البلدية:</label>
        <select
          required
          value={commune}
          onChange={(e) => setCommune(e.target.value)}
        >
          <option value="">اختر البلدية</option>
          {communesList.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label>رقم الهاتف:</label>
        <input
          type="text"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <label>البريد الإلكتروني:</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>كلمة المرور:</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" style={{ marginTop: 15 }}>
          تسجيل
        </button>

      </form>

      {msg && <p style={{ marginTop: 15 }}>{msg}</p>}
    </div>
  );
}