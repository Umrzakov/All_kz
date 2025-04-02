import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Функция для обработки логина через email и пароль
  const handleEmailLogin = async (e) => {
    e.preventDefault();  // Предотвращаем перезагрузку страницы

    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("jwtToken", data.token); // Сохраняем токен
        // Редирект на главную страницу или другую
        navigate("/");
        console.log("Авторизация прошла успешно");
      } else {
        alert(data.message); // Выводим сообщение об ошибке
      }
    } catch (error) {
      console.error("Ошибка при авторизации:", error);
    }
  };

  // Функция для обработки логина через Google
  const handleGoogleLogin = async (response) => {
    if (response.credential) {
      try {
        const res = await fetch("http://localhost:3001/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: response.credential }),
        });

        const data = await res.json();

        if (data.token) {
          localStorage.setItem("jwtToken", data.token); // Сохраняем токен
          navigate("/"); // Перенаправление на главную страницу
          console.log("Авторизация через Google прошла успешно");
        }
      } catch (error) {
        console.error("Ошибка авторизации через Google:", error);
        alert("Ошибка авторизации через Google");
      }
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
        onError={() => alert("Ошибка авторизации через Google")}
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
