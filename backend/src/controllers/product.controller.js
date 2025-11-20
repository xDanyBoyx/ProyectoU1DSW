import { validateProduct } from "../utils/validations.js";
import Product from "../models/product.model.js";
import { createFacturapiProducto } from "../services/facturapiService.js";

//GET ALL
async function getAll(req, res) {
  const filters = req.query;
  
  try {
    if (Object.keys(filters).length > 0) {
      const data = await Product.filterProduct(filters);
      return res.status(200).json(data);
    }

    const data = await Product.findAll();

    res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

//GET ID
async function getById(req, res) {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });
    res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

//POST
async function add(req, res) {
  const { name, brand, stock, price, category, urlimg, codesat } = req.body;

  try {
    const errors = validateProduct(req.body);
    if (errors) {
      return res.status(400).json({
        errors,
      });
    }

    const productFacturapi = await createFacturapiProducto(req.body);

    if (!productFacturapi) {
      return res.status(500).json({ message: "Error al añadir producto" });
    }

    const newProduct = await Product.addProduct({
      name,
      brand,
      stock,
      price,
      category,
      urlimg,
      codesat,
      id_facturapi: productFacturapi.id
    });

    res.status(201).json({
      message: "Producto registrado correctamente",
      product: newProduct
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

//PUT
async function update(req, res) {
  const id = req.params.id;

  const errors = validateProduct(req.body);
  if (errors) {
    return res.status(400).json({
      errors,
    });
  }

  try {
    const updatedProduct = await Product.updateProduct(id, req.body);
    if (!updatedProduct)
      return res.status(404).json({ error: "Producto no encontrado" });

    res.status(200).json(updatedProduct);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

//DELETE
async function remove(req, res) {
  try {
    const id = req.params.id;
    const ok = await Product.deleteProduct(id);
    if (!ok) return res.status(404).json({ error: "Producto no encontrado" });
    res.status(200).json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

//EXPORTAMOS LAS FUNCIONES (ESM)
export default {
  getAll,
  getById,
  add,
  update,
  remove
};
