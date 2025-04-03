import mongoose from 'mongoose';
import fs from 'fs';
import Product from './src/models/productModel.js'; // Путь к модели товара

// Подключение к базе данных
mongoose.connect('mongodb://localhost:27017/all_kz')
  .then(() => console.log("MongoDB подключен"))
  .catch((err) => console.log(err));

// Чтение JSON файла и загрузка товаров в MongoDB
const jsonFilePath = './src/data/products.json'; // Путь к вашему JSON файлу

fs.readFile(jsonFilePath, 'utf8', (err, data) => {
  if (err) {
    console.log("Ошибка при чтении JSON файла:", err);
    return;
  }

  const products = JSON.parse(data); // Преобразуем данные в массив объектов

  // Вставляем товары в базу данных
  Product.insertMany(products)
    .then(() => {
      console.log("Товары успешно добавлены!");
      mongoose.connection.close(); // Закрываем соединение с MongoDB
    })
    .catch((err) => console.log("Ошибка при добавлении товаров:", err));
});
