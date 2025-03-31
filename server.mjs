import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import OpenAI from "openai";
import products from "./src/data/products.js";  // Дұрыс импорт

dotenv.config();
console.log("🔑 OpenAI KEY =", process.env.OPENAI_API_KEY);

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    res.json({ reply: chatCompletion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).send("Ошибка при обращении к OpenAI API");
  }
});

app.listen(port, () => {
  console.log(`✅ AI сервер запущен: http://localhost:${port}`);
});
