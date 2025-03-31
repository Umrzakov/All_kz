import React, { useState } from "react";
import Chat from "./Chat";
import Navbar from "./components/Navbar"; // импорт
import SearchWithFilters from "./SearchWithFilters";

export default function App() {
  const [started, setStarted] = useState(false);

  return (
    <>
      <div className="font-sans bg-white text-gray-800">
        {/* Header */}
        <header className="w-full shadow p-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">All.kz</div>
          <nav className="space-x-6">
            <Navbar />
          </nav>
        </header>

        {/* Hero Section */}
        {!started && (
          <section className="bg-blue-100 p-10 flex flex-col md:flex-row items-center justify-between">
            <div className="max-w-xl">
              <h1 className="text-4xl font-bold text-blue-700 mb-4">
                Добро пожаловать в All.kz
              </h1>
              <p className="text-lg mb-6">
                Продавайте и покупайте легко с помощью ИИ. Умные предложения.
                Быстрый поиск.
              </p>
              <button
                onClick={() => setStarted(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Начать
              </button>
            </div>

            <img
              src="https://kaspi.kz/img/m-app-promo.3b7ba5e3.svg"
              alt="App demo"
              className="w-full max-w-md mt-10 md:mt-0"
            />
          </section>
        )}

        {/* Категории и ИИ */}
        {started && (
          <main className="p-6 grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <SearchWithFilters />
            </div>

            <div>
              <Chat />
            </div>
          </main>
        )}

        {/* Footer */}
        <footer className="bg-gray-100 p-6 text-center text-sm text-gray-500">
          © 2025 All.kz — Платформа с ИИ для умной торговли. Все права защищены.
        </footer>
      </div>
    </>
  );
}
