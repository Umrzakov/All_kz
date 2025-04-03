import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export default function ProductPage() {
  const { id } = useParams(); // Получаем id товара из URL
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/products/${id}`);
        const data = await res.json();
        setProduct(data); // Устанавливаем полученные данные о товаре
      } catch (error) {
        console.error("Ошибка при загрузке товара:", error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="text-center text-gray-500 p-6">
        Товар не найден 😢
        <br />
        <Link to="/" className="text-blue-500 hover:underline">← Назад к каталогу</Link>
      </div>
    );
  }

  return (
    <div className="product-detail-container p-6">
      <Link to="/" className="text-blue-500 hover:underline text-sm">← Назад к каталогу</Link>

      <div className="mt-4 bg-white rounded shadow p-6">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-80 object-cover rounded mb-4"
        />
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        <p className="text-gray-600 mb-2">{product.category}</p>
        <p className="text-xl text-blue-600 font-semibold mb-4">{product.price} ₸</p>
        <p className="text-gray-800 mb-4">{product.description}</p>

        <button
          onClick={() => {
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            cart.push(product);
            localStorage.setItem("cart", JSON.stringify(cart));
            alert("Товар добавлен в корзину 🛒");
          }}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          🛒 Добавить в корзину
        </button>
      </div>
    </div>
  );
}
