import { validateProduct, validateProductUpdate } from "../utils/validations.js";
import Product from "../models/product.model.js";

//FUNCIÓN DE VALIDACIONES
// isNew: si true valida campos obligatorios para creación; si false valida sólo los campos presentes
const validateProductData = (data, isNew = true) => {
  const errors = {};

  if ((isNew || data.name !== undefined) && !data.name) {
    errors.name = "El nombre del producto es requerido.";
  }

  if ((isNew || data.price !== undefined)) {
    if (!data.price) {
      errors.price = "El precio es requerido.";
    } else if (isNaN(data.price) || Number(data.price) <= 0) {
      errors.price = "El precio debe ser un número mayor que 0.";
    }
  }

  if ((isNew || data.stock !== undefined)) {
    if (data.stock && (isNaN(data.stock) || Number(data.stock) < 0)) {
      errors.stock = "El stock debe ser un número mayor o igual a 0.";
    }
  }

  if ((isNew || data.category !== undefined) && !data.category) {
    errors.category = "La categoría es requerida.";
  }

  //DEVOLVEMOS ERRORES SI EXISTEN
  return Object.keys(errors).length > 0 ? errors : null;
};

//GET ALL
async function getAll(req, res) {
  const filters = req.query;

  try {
    if (Object.keys(filters).length > 0) {
      const data = await Product.filterProduct(filters);
      return res.status(200).json(data);
    }

    const data = await Product.findAll();
    console.log(data);

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
        message: "Datos del producto inválidos",
        errors,
      });
    }

    const newProduct = await Product.addProduct({
      name,
      brand,
      stock,
      price,
      category,
      urlimg,
      codesat,
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

  const errors = validateProductUpdate(req.body);
  if (errors) {
    return res.status(400).json({
      message: "Datos de actualización inválidos",
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
