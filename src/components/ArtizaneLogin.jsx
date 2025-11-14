// src/components/ArtisanLogin.jsx
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

export default function ArtisanLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const login = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMsg("تم تسجيل الدخول بنجاح ✔");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setMsg("خطأ في تسجيل الدخول ❌");
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: 20 }}>
      <h2>تسجيل الدخول للحرفيين</h2>

      <form onSubmit={login}>
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

        <button type="submit" style={{ marginTop: 12 }}>
          دخول
        </button>
      </form>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
    </div>
  );
}