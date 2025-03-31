import React, { useEffect, useState } from "react";

export default function Navbar() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCount(cart.length);
  }, []);

  return (
      <nav className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">

          <header className="w-full shadow p-4 flex items-center justify-between">
              <nav className="space-x-6">
                  <a href="#" className="hover:text-blue-500">Каталог</a>
                  <a href="#" className="hover:text-blue-500">О нас</a>
                  <a href="#" className="hover:text-blue-500">Контакты</a>
                  <a> </a>
              </nav>
              <a href="/cart" className="hover:text-blue-500">
          🛒 Корзина {count > 0 && `(${count})`}
        </a>
          </header>
      </nav>
);
}
