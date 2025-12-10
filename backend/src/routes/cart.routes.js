import express from 'express';
import controller from '../controllers/cart.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authorize(['cliente'])); // Solo los usuarios con role = 'cliente' pueden operar con los carritos

router.get('/', controller.getCurrentCart);
router.post('/', controller.addProductsToCart); // agregar productos al carrito activo o crear uno nuevo si no tiene carrito
router.get('/all', controller.getAllCarts);
router.post('/products/:productId', controller.updateQtyProductInCart);
router.delete('/products/:productId', controller.removeProductFromCart);
router.delete('/clear', controller.clearCart);
router.post('/pay', controller.payCart);

export default router;