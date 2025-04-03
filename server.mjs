
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import OpenAI from 'openai'; // Подключаем OpenAI
import bcrypt from 'bcrypt';  // Импорт bcrypt
import helmet from 'helmet';  // Импорт helmet для безопасности
import Product from "./src/data/products.js";

dotenv.config();

console.log("🔑 OpenAI KEY =", process.env.OPENAI_API_KEY);

const app = express();
const port = process.env.PORT || 3001;
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const oauth2Client = new OAuth2Client(CLIENT_ID);

app.use(helmet());  // Подключаем Helmet для улучшенной безопасности
// Middleware для обработки JSON и CORS
app.use(express.json());
app.use(cors());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://apis.google.com", "https://accounts.google.com"],
      connectSrc: ["'self'", "https://accounts.google.com"],
      imgSrc: ["'self'", "https://example.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  })
);

// Подключение к MongoDB
// Подключаемся к MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB подключена'))
  .catch((err) => console.error('Ошибка MongoDB:', err));


// Модель пользователя
const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true },
  email: { type: String, required: true, unique: true },
  name: String,
  password: String // если регистрация через пароль
});

const User = mongoose.model('User', userSchema);

// Валидация Google-токена
const verifyToken = async (token) => {
  const ticket = await oauth2Client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,
  });
  return ticket.getPayload();
};

// Инициализация OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Получите ключ API на платформе OpenAI
});

// Роут для получения всех товаров
app.get('/api/products', async (req, res) => {
  const { query, category } = req.query; // Получаем параметры фильтрации

  try {
    const filter = {};
    if (query) {
      filter.name = { $regex: query, $options: 'i' }; // Фильтруем по названию
    }
    if (category) {
      filter.category = category; // Фильтруем по категории
    }

    const products = await Product.find(filter); // Находим продукты, которые соответствуют фильтрам
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Ошибка загрузки товаров" });
  }
});

// ✅ Роут авторизации через Google
app.post('/api/auth/google', async (req, res) => {
  const { token } = req.body;

  try {
    const googleUser = await verifyToken(token);
    let user = await User.findOne({ googleId: googleUser.sub });

    if (!user) {
      user = new User({
        googleId: googleUser.sub,
        email: googleUser.email,
        name: googleUser.name,
      });
      await user.save();
    }

    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token: jwtToken });

  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Ошибка авторизации через Google' });
  }
});

// ✅ Роут регистрации через Email/пароль
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь уже существует' });
    }
    const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds); // Хешируем пароль
    const user = new User({ email, password: hashedPassword  }); // пароль храни зашифрованным в реальном проекте
    await user.save();

    res.status(201).json({ message: 'Пользователь создан' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка регистрации' });
  }
});

// ✅ Роут логина через Email/пароль
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) { // ⚠️ В реальном проекте используй bcrypt
      return res.status(401).json({ message: 'Неверные данные входа' });
    }

    const isMatch = await bcrypt.compare(password, user.password); // Сравниваем пароль с хешированным

    if (!isMatch) {
      return res.status(401).json({ message: "Неверные данные входа" });
    }

    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token: jwtToken });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка авторизации' });
  }
});

// ✅ Роут для общения с OpenAI
// Обработчик для API-эндпоинта /api/chat
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;  // Получаем сообщение от клиента

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    res.json({ reply: chatCompletion.choices[0].message.content });  // Отправляем ответ на клиент
  } catch (err) {
    console.error("Ошибка при запросе к OpenAI:", err);
    res.status(500).send("Ошибка при обращении к OpenAI API");  // Отправляем ошибку клиенту
  }
});

// Добавление нового товара
app.post("/api/products/:id", async (req, res) => {
  const { name, description, price, category, image } = req.body;

  const newProduct = new Product({
    name,
    description,
    price,
    category,
    image,
  });

  try {
    await newProduct.save();
    res.status(201).json({ message: "Товар добавлен" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка при добавлении товара" });
  }
});


// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
