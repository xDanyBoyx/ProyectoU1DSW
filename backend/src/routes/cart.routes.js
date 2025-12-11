import express from 'express';
import controller from '../controllers/cart.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// RUTA SOLO PARA ADMIN, PUEDE VER TODAS LAS COMPRAS/CARRITOS ACTIVOS
router.get('/all', authorize(['admin']), controller.getAllCarts);

router.get('/', authorize(['cliente']), controller.getCurrentCart);
router.post('/', authorize(['cliente']), controller.addProductsToCart); // agregar productos al carrito activo o crear uno nuevo si no tiene carrito
router.post('/products/:productId', authorize(['cliente']), controller.updateQtyProductInCart);
router.delete('/products/:productId', authorize(['cliente']), controller.removeProductFromCart);
router.delete('/clear', authorize(['cliente']), controller.clearCart);
router.post('/pay', authorize(['cliente']), controller.payCart);

export default router;