import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState(""); // Для поиска по названию
  const [category, setCategory] = useState(""); // Для фильтрации по категории

  useEffect(() => {
    // Получаем товары с сервера
    const fetchProducts = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/products?query=${query}&category=${category}`);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Ошибка при загрузке товаров:", error);
      }
    };
    fetchProducts();
  }, [query, category]); // Перезагружаем товары при изменении query или category

  return (
    <div className="catalog-container p-6">
      <h1 className="text-3xl font-bold mb-6">Каталог товаров</h1>

      <div className="filters mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по названию"
          className="border px-3 py-2 rounded w-full mb-4 md:w-80"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-80"
        >
          <option value="">Все категории</option>
          <option value="Электроника">Электроника</option>
          <option value="Техника">Техника</option>
          <option value="Аксессуары">Аксессуары</option>
          <option value="Игры">Игры</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.length === 0 ? (
          <p>Нет товаров для отображения</p>
        ) : (
          products.map((product) => (
            <div key={product._id} className="product-card border p-4 rounded-lg shadow-sm">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-600">{product.category}</p>
              <p className="text-blue-600 font-bold">{product.price} ₸</p>
              <Link to={`/product/${product._id}`}>
                <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Подробнее
                </button>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
