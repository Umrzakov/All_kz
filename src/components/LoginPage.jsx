import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      alert("Ошибка входа. Проверьте email и пароль.");
      console.error(err);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    const token = credentialResponse.credential;
    const user = jwtDecode(token);
    try {
      const res = await axios.post("/api/auth/google", { token });
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Ошибка авторизации Google.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 border shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-center mb-4">Авторизация</h2>

      <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Войти
        </button>
      </form>

      <div className="mb-4 text-center">или</div>

      <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={() => alert("Ошибка авторизации Google")}
      />

      <p className="mt-4 text-center">
        Нет аккаунта?{" "}
        <Link to="/register" className="text-blue-600 hover:underline">
          Зарегистрируйтесь
        </Link>
      </p>
    </div>
  );
}
