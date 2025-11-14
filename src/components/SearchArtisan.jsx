import React, { useState } from "react";
import wilayasData from "../data/wilayas.json";

export default function SearchArtisan() {
  const [wilayas] = useState(wilayasData.map(w => w.name));
  const [dairas, setDairas] = useState([]);
  const [communes, setCommunes] = useState([]);

  const [selectedWilaya, setSelectedWilaya] = useState("");
  const [selectedDaira, setSelectedDaira] = useState("");
  const [selectedCommune, setSelectedCommune] = useState("");

  // اختيار الولاية
  const handleWilayaChange = (e) => {
    const w = e.target.value;
    setSelectedWilaya(w);

    const wilayaObj = wilayasData.find((item) => item.name === w);
    setDairas(wilayaObj ? wilayaObj.dairas : []);
    setCommunes([]);
  };

  // اختيار الدائرة
  const handleDairaChange = (e) => {
    const d = e.target.value;
    setSelectedDaira(d);

    const dairaObj = dairas.find((item) => item.name === d);
    setCommunes(dairaObj ? dairaObj.communes : []);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>البحث عن حرفي</h2>

      {/* الولاية */}
      <label>الولاية:</label>
      <select value={selectedWilaya} onChange={handleWilayaChange}>
        <option value="">اختر الولاية</option>
        {wilayas.map((w) => (
          <option key={w} value={w}>
            {w}
          </option>
        ))}
      </select>

      {/* الدائرة */}
      <label style={{ display: "block", marginTop: 12 }}>الدائرة:</label>
      <select value={selectedDaira} onChange={handleDairaChange}>
        <option value="">اختر الدائرة</option>
        {dairas.map((d) => (
          <option key={d.name} value={d.name}>
            {d.name}
          </option>
        ))}
      </select>

      {/* البلدية */}
      <label style={{ display: "block", marginTop: 12 }}>البلدية:</label>
      <select
        value={selectedCommune}
        onChange={(e) => setSelectedCommune(e.target.value)}
      >
        <option value="">اختر البلدية</option>
        {communes.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* زر البحث */}
      <button style={{ display: "block", marginTop: 20 }}>بحث</button>
    </div>
  );
}