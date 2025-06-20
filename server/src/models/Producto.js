const { Schema, model } = require('mongoose');

const ProductoSchema = new Schema({
  descripcion: String,
  marca: String,
  categoria: String,
  precio: Number,
  stock_inicial: Number,
  stock_futuro: { type: Number, default: 0 }
});

module.exports = model('Producto', ProductoSchema);