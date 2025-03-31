/* global webkitSpeechRecognition */

import React, { useState } from "react";
import { Link } from "react-router-dom";
// Импортируем products как named import
import products from "./data/products.js";  // data папкасына бір деңгей жоғары


export default function SearchWithFilters() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [filtered, setFiltered] = useState([]);

  const handleSearch = () => {
    const results = products.filter((item) => {
      const matchName = item.name.toLowerCase().includes(query.toLowerCase());
      const matchCategory = category ? item.category === category : true;
      return matchName && matchCategory;
    });
    setFiltered(results);
  };

  const handleVoiceInput = () => {
  const recognition = new window.webkitSpeechRecognition() || new window.SpeechRecognition();
  recognition.lang = "ru-RU"; // можешь сменить на "kk-KZ" или "en-US"
  recognition.start();

  recognition.onresult = (event) => {
let voiceText = event.results[0][0].transcript.trim();
voiceText = voiceText.replace(/[.,!?]+$/, ""); // убирает точку, запятую, воскл. знак и пр.
    setQuery(voiceText);
    setTimeout(() => handleSearch(), 200); // запустим поиск после речи
  };

  recognition.onerror = (e) => {
    console.error("Ошибка голосового ввода:", e);
    alert("Ошибка при распознавании голоса");
  };
};

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      <h2 className="text-xl font-semibold mb-4">🔍 Поиск с фильтрами</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по названию"
            className="border px-3 py-2 rounded w-full"
        />
        <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border px-3 py-2 rounded w-full md:w-60"
        >
          <option value="">Все категории</option>
          <option>Телефоны</option>
          <option>Компьютеры</option>
          <option>Одежда</option>
          <option>Бытовая техника</option>
        </select>
        <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Найти
        </button>
        <button
            onClick={handleVoiceInput}
            className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300"
        >
          🎤
        </button>

      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 shadow-sm flex flex-col">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-gray-600">{item.category}</p>
            <p className="text-blue-600 font-bold mb-2">{item.price}</p>

            <Link to={`/product/${item.id}`} className="mt-auto">
              <button className="bg-blue-500 text-white w-full px-4 py-2 rounded hover:bg-blue-600">
                Подробнее
              </button>
            </Link>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-gray-500">
            Ничего не найдено. Попробуйте изменить запрос.
          </p>
        )}
      </div>
    </div>
  );
}
