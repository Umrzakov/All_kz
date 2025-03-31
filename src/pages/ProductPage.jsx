import React from "react";
import { useParams, Link } from "react-router-dom";
import products from "../data/products";

export default function ProductPage() {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="p-6 text-center text-gray-500">
        Товар не найден 😢
        <br />
        <Link to="/" className="text-blue-500 hover:underline">← Назад к каталогу</Link>
      </div>
    );
  }

  return (
      <div className="max-w-3xl mx-auto p-6">
          <Link to="/" className="text-blue-500 hover:underline text-sm">← Назад к каталогу</Link>

          <div className="mt-4 bg-white rounded shadow p-6">
              <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-80 object-cover rounded mb-4"
              />
              <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
              <p className="text-gray-600 mb-2">{product.category}</p>
              <p className="text-xl text-blue-600 font-semibold mb-4">{product.price}</p>

              <p className="text-gray-800 mb-4">
                  Здесь будет описание товара, характеристики, материалы, доставка, отзывы и другое. Можно подключить
                  реальные данные с сервера или CMS.
              </p>

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
          <div className="mt-12">
              <h2 className="text-xl font-semibold mb-4">🔁 Похожие товары</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {products
                      .filter((p) => p.category === product.category && p.id !== product.id)
                      .slice(0, 3)
                      .map((item) => (
                          <div key={item.id} className="border rounded-lg p-4 shadow-sm flex flex-col">
                              <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-40 object-cover rounded mb-2"
                              />
                              <h3 className="font-semibold">{item.name}</h3>
                              <p className="text-gray-600">{item.category}</p>
                              <p className="text-blue-600 font-bold mb-2">{item.price}</p>
                              <Link to={`/product/${item.id}`}>
                                  <button
                                      className="mt-auto bg-blue-500 text-white w-full px-4 py-2 rounded hover:bg-blue-600">
                                      Подробнее
                                  </button>
                              </Link>
                          </div>
                      ))}
              </div>
          </div>
      </div>


  );
}
