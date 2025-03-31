import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.phone || !form.address) {
      alert("Пожалуйста, заполните все поля");
      return;
    }

    // Здесь можно отправить на сервер
    console.log("📦 Заказ оформлен:", form, cart);
    localStorage.removeItem("cart");
    alert("Спасибо за заказ! Мы свяжемся с вами.");
    navigate("/");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4">🧾 Оформление заказа</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500">Корзина пуста</p>
      ) : (
        <>
          <ul className="mb-4">
            {cart.map((item, index) => (
              <li key={index} className="border-b py-2">
                {item.name} — <span className="text-blue-600">{item.price}</span>
              </li>
            ))}
          </ul>

          <div className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Имя"
              value={form.name}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Телефон"
              value={form.phone}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
            />
            <textarea
              name="address"
              placeholder="Адрес доставки"
              value={form.address}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
            ></textarea>

            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              ✅ Оформить заказ
            </button>
          </div>
        </>
      )}
    </div>
  );
}
