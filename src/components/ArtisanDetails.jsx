import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";

export default function ArtisanDetails() {
  const { id } = useParams();
  const [artisan, setArtisan] = useState(null);

  useEffect(() => {
    const load = async () => {
      const snap = await getDoc(doc(db, "artisans", id));
      if (snap.exists()) setArtisan(snap.data());
    };
    load();
  }, [id]);

  if (!artisan) return <p>جاري التحميل...</p>;

  return (
    <div className="page">
      <h2>معلومات الحرفي</h2>

      <div className="artisan-card" style={{ padding: 20 }}>
        <h3>{artisan.name}</h3>
        <p>📞 {artisan.phone}</p>
        <p>📍 {artisan.wilaya} — {artisan.daira}</p>

        {artisan.vip && (
          <p style={{ color: "gold", fontWeight: "bold" }}>⭐ حرفي مميز (VIP)</p>
        )}
      </div>
    </div>
  );
}