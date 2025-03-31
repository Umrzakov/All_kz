import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function CartPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      setCart(JSON.parse(saved));
    }
  }, []);

  const removeItem = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const total = cart.reduce((sum, item) => {
    const price = parseInt(item.price.replace(/\D/g, ""));
    return sum + price;
  }, 0);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🛒 Ваша корзина</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500">Корзина пуста</p>
      ) : (
        <>
          <ul className="divide-y">
            {cart.map((item, index) => (
              <li key={index} className="flex justify-between py-4">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.price}</p>
                </div>
                <button
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:underline"
                >
                  Удалить
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 font-semibold">
            Итого: {total.toLocaleString()} ₸
          </div>
        </>
      )}

      <Link to="/" className="mt-6 inline-block text-blue-500 hover:underline">
        ← Назад к покупкам
      </Link>
      <Link>
      </Link>
      <Link to="/checkout">
  <button className="mt-4 text-left bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
    ✅ Оформить заказ
  </button>
</Link>
    </div>

  );
}
