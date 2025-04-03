import React, { useState, useRef, useEffect } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Привет! Я твой виртуальный помощник. Чем могу помочь?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const chatContainerRef = useRef(null); // Реф для контейнера чата

  useEffect(() => {
    // Прокручиваем контейнер чата вниз при обновлении сообщений
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) {
      alert("Пожалуйста, введите текст.");
      return;
    }

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
    } catch (error) {
      console.error("Ошибка:", error);
      setMessages((prev) => [...prev, { role: "ai", text: "Произошла ошибка 😥" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceInput = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "ru-RU"; // можно kk-KZ, en-US
    recognition.start();

    recognition.onresult = (event) => {
      let voiceText = event.results[0][0].transcript.trim();
      voiceText = voiceText.replace(/[.,!?]+$/, "");
      setInput(voiceText);
      setTimeout(() => sendMessage(), 300); // немного подождать перед отправкой
    };

    recognition.onerror = (e) => {
      console.error("Ошибка голосового ввода:", e);
      alert("Ошибка при распознавании голоса");
    };
  };

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white h-[500px] flex flex-col">
      <h2 className="text-xl font-semibold mb-2">💬 AI чат</h2>

      <button
        onClick={toggleCollapse}
        className="self-end mb-4 text-sm text-blue-500 hover:underline"
      >
        {isCollapsed ? "Развернуть чат" : "Свернуть чат"}
      </button>

      <div
        ref={chatContainerRef} // Реф для прокрутки чата
        className={`flex-1 overflow-auto space-y-2 mb-2 transition-all duration-300 ease-in-out ${
          isCollapsed ? "max-h-0 overflow-hidden" : "max-h-[calc(100%-150px)]"
        }`}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded max-w-[80%] ${
              msg.role === "user" ? "bg-blue-100 text-right ml-auto" : "bg-gray-100 text-left"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {isTyping && (
          <div className="text-gray-400 italic text-sm">AI печатает...</div>
        )}
      </div>

      <div className="flex space-x-1">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 border px-3 py-1 rounded"
          placeholder="Скажи или напиши..."
        />
        <button
          onClick={handleVoiceInput}
          className="bg-gray-200 text-black px-3 rounded hover:bg-gray-300"
        >
          🎤
        </button>
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
          disabled={!input.trim()}  // Блокируем кнопку "Отправить", если нет текста
        >
          Отправить
        </button>
      </div>
    </div>
  );
}
