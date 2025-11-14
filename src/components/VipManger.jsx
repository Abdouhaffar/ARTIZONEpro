import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

export default function VipManager() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "vipRequests"));
      setRequests(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    load();
  }, []);

  const approve = async (id) => {
    await updateDoc(doc(db, "vipRequests", id), {
      status: "approved"
    });
    alert("✔ تم التفعيل بنجاح");

    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r))
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>👑 إدارة اشتراكات VIP</h2>

      {requests.map((r) => (
        <div
          key={r.id}
          style={{
            background: "#eee",
            padding: 10,
            marginTop: 10,
            borderRadius: 8
          }}
        >
          <p>🧑‍🔧 المستخدم: {r.uid}</p>
          <p>⏳ الخطة: {r.plan}</p>
          <p>💰 السعر: {r.price} دج</p>
          <p>📄 الحالة: {r.status}</p>

          {r.proofUrl && (
            <a
              href={r.proofUrl}
              target="_blank"
              rel="noreferrer"
              style={{ color: "blue" }}
            >
              عرض الوصل 📄
            </a>
          )}

          {r.status !== "approved" && (
            <button
              onClick={() => approve(r.id)}
              style={{
                background: "gold",
                border: "none",
                padding: "5px 10px",
                marginTop: 8,
                cursor: "pointer"
              }}
            >
              تفعيل الاشتراك
            </button>
          )}
        </div>
      ))}
    </div>
  );
}