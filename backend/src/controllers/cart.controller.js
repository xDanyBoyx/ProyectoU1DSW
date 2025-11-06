import Cart from "../models/cart.model.js";

// GET ALL
async function getAll(req, res) {
  try {
    const carts = await Cart.findAll();
    res.status(200).json(carts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// GET BY ID
async function getById(req, res) {
  try {
    const id = req.params.id;
    const cart = await Cart.findById(id);

    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// POST (Crear carrito)
async function add(req, res) {
  const { userId, products } = req.body;

  if (!userId || !Array.isArray(products) || products.length === 0) {
    return res.status(400).json({
      message: "El carrito requiere un usuario válido y al menos un producto.",
    });
  }

  try {
    const newCart = await Cart.addCart({ userId, products });
    res.status(201).json({
      message: "Carrito creado correctamente",
      cart: newCart,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// PUT (Actualizar estado de pago)
async function updatePaid(req, res) {
  try {
    const id = req.params.id;
    const { paid } = req.body;

    if (typeof paid !== "boolean") {
      return res.status(400).json({
        message: "El campo 'paid' debe ser booleano (true o false).",
      });
    }

    const updated = await Cart.updatePaid(id, paid);
    res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// DELETE
async function remove(req, res) {
  try {
    const id = req.params.id;
    const deleted = await Cart.deleteCart(id);

    if (!deleted) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.status(200).json({ message: "Carrito eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// EXPORTAMOS LAS FUNCIONES (ESM)
export default {
  getAll,
  getById,
  add,
  updatePaid,
  remove,
};