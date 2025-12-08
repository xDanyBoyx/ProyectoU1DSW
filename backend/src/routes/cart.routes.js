import express from 'express';
import controller from '../controllers/cart.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', controller.getCurrentCart);
// agregar productos al carrito activo o crear uno nuevo si no tiene carrito
router.post('/', controller.addProductsToCart); 
router.get('/all', controller.getAllCarts);
router.post('/products/:productId', controller.updateQtyProductInCart);
router.delete('/products/:productId', controller.removeProductFromCart);
router.delete('/clear', controller.clearCart);
router.post('/pay', controller.payCart);


export default router;