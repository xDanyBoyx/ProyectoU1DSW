//IMPORTAMOS EL MODELO
const Product = require("../models/product.model");

//GET
function getAll(req, res) {
  const filters = req.query;

  if (Object.keys(filters).length > 0) {
    const data = Product.filterProduct(filters);
    return res.status(200).json(data);
  }

  const data = Product.findAll();
  res.status(200).json(data);
}

//GET ID
function getById(req, res) {
  const id = req.params.id;
  const product = Product.findById(id);

  if (!product)
    return res.status(404).json({ error: "Producto no encontrado" });

  res.status(200).json(product);
}

//POST
function add(req, res) {
  const { name, brand, stock, price, category, urlimg, codesat } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({
      error: "Faltan campos obligatorios: name, price, category",
    });
  }

  const newProduct = Product.addProduct({
    name,
    brand,
    stock,
    price,
    category,
    urlimg,
    codesat,
  });

  res.status(201).json(newProduct);
}

//PUT
function update(req, res) {
  const id = req.params.id;
  const updatedProduct = Product.updateProduct(id, req.body);

  if (!updatedProduct)
    return res.status(404).json({ error: "Producto no encontrado" });

  res.status(200).json(updatedProduct);
}

//DELETE
function remove(req, res) {
  const id = req.params.id;
  const ok = Product.deleteProduct(id);

  if (!ok) return res.status(404).json({ error: "Producto no encontrado" });

  res.status(200).json({ message: "Producto eliminado correctamente" });
}

// EXPORTAMOS TODAS LAS FUNCIONES PARA LAS RUTAS
module.exports = {
  getAll,
  getById,
  add,
  update,
  remove,
};
