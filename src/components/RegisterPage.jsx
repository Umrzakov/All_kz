import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
  e.preventDefault();
  try {
    await axios.post("http://localhost:3001/api/auth/register", { email, password });
    alert("Регистрация успешна, теперь вы можете войти.");
    navigate("/login");
  } catch (err) {
    alert("Ошибка регистрации.");
    console.error(err);
  }
};


  return (
    <div className="w-full max-w-md mx-auto p-6 border shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-center mb-4">Регистрация</h2>

      <form onSubmit={handleRegister} className="space-y-4">
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
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Зарегистрироваться
        </button>
      </form>

      <p className="mt-4 text-center">
        Уже есть аккаунт?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Войдите
        </Link>
      </p>
    </div>
  );
}
