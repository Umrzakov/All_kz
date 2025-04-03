import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  image: String, // URL изображения товара
});

const Product = mongoose.model('Product', productSchema);

export default Product;
