import userModel from "../models/user.model.js";
import productModel from "../models/product.model.js";
import cartModel from "../models/cart.model.js";
import { createPaymentIntent } from "../services/stripeService.js";
import { createFacturapiInvoice, downloadAndSaveInvoice } from "../services/facturapiService.js";
import { sendOrderConfirmation } from "../services/sendgridService.js";

// METODO PARA CREAR UN NUEVO CARRITO CON INFORMACIÓN DEL USUARIO AUTENTICADO
//DESCOMENTAR LA FUNCION CUANDO SE REQUIERA USAR LA AUTENTICACIÓN
const createCart = async (req, res) => {

    // obtener el id del usuario de la request (establecido por el middleware de autenticación)
    const { userId, userRole, userMail } = req;

    const { products } = req.body; // products con forma [{id, qty}, ...]

    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(500).json({ message: "Error al crear el carrito." });
        }
        if (userRole !== 'cliente') {
            return res.status(403).json({ message: "Solo los usuarios con rol de 'cliente' pueden crear un carrito." });
        }

        let productosEnCarrito = [];
        let subtotal = 0;
        let iva = 0;
        let total = 0;
        const createdAt = new Date();
        const paidAt = null;
        const id_facturapi = null;
        const id_stripe = null;

        if (products.length > 0) {
            let productPrices = [];
            const productIds = products.map(p => p.id);
            /*
            productPrices tiene forma:
                [
                    { id: 'JYe4ZSunE19XO8BIpwYX', price: 3200 },
                    { id: 'LogCQVhP5yFsgd6nBNDd', price: 24999 }
                ]
            */
            productPrices = await productModel.getProductsPriceByIds(productIds);
            productPrices.forEach(pp => {
                const qty = products.find(p => p.id === pp.id).qty;
                productosEnCarrito.push({
                    product: {
                        id: pp.id,
                        price: pp.price
                    },
                    qty: qty,
                    subtotal: pp.price * qty
                });
            });
            subtotal = productosEnCarrito.reduce((acumulador, item) => acumulador + item.subtotal, 0);
            iva = parseFloat((subtotal * 0.16).toFixed(2));
            total = parseFloat((subtotal + iva).toFixed(2));
        }

        const newCart = {
            user,
            products: productosEnCarrito,
            subtotal,
            iva,
            total,
            createdAt,
            paidAt,
            id_facturapi,
            id_stripe
        };

        const createCartResponse = await cartModel.createNewCart(newCart);

        return res.status(201).json(createCartResponse);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// METODO DE PRUEBA PARA CREAR UN NUEVO CARRITO SIN INFORMACIÓN DE USUARIO
// NO REQUIERE AUTENTICACIÓN POR JWT
// COMENTAR LA FUNCION DE ABAJO Y DESCOMENTAR LA DE ARRIBA CUANDO SE REQUIERA USAR LA AUTENTICACIÓN
// const createCart = async (req, res) => {

//     const { products } = req.body; // products con forma [{id, qty}, ...]

//     try {
//         const user = {} //temporal
//         if (!user) {
//             return res.status(404).json({ message: "Usuario no encontrado" });
//         }

//         let productosEnCarrito = [];
//         let subtotal = 0;
//         let iva = 0;
//         let total = 0;
//         const createdAt = new Date();
//         const paidAt = null;
//         const id_facturapi = null;
//         const id_stripe = null;

//         if (products.length > 0) {
//             let productPrices = [];
//             const productIds = products.map(p => p.id);
//             /*
//             productPrices tiene forma:
//                 [
//                     { id: 'JYe4ZSunE19XO8BIpwYX', price: 3200 },
//                     { id: 'LogCQVhP5yFsgd6nBNDd', price: 24999 }
//                 ]
//             */
//             productPrices = await productModel.getProductsPriceByIds(productIds);
//             productPrices.forEach(pp => {
//                 const qty = products.find(p => p.id === pp.id).qty;
//                 productosEnCarrito.push({
//                     product: {
//                         id: pp.id,
//                         price: pp.price
//                     },
//                     qty: qty,
//                     subtotal: pp.price * qty
//                 });
//             });
//             subtotal = productosEnCarrito.reduce((acumulador, item) => acumulador + item.subtotal, 0);
//             iva = parseFloat((subtotal * 0.16).toFixed(2));
//             total = parseFloat((subtotal + iva).toFixed(2));
//         }

//         const newCart = {
//             user,
//             products: productosEnCarrito,
//             subtotal,
//             iva,
//             total,
//             createdAt,
//             paidAt,
//             id_facturapi,
//             id_stripe
//         };

//         const createCartResponse = await cartModel.createNewCart(newCart);

//         return res.status(201).json(createCartResponse);

//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// };

const getAllCarts = async (req, res) => {
    try {
        const data = await cartModel.getAll();
        res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// TODO: obtener el carrito activo del usuario, requiere autenticación
// carrito no pagado, osea cuando paidAt es null
const getCurrentCart = async (req, res) => {
    const { userId, userRole, userMail } = req;
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "El usuario no existe." });
        }
        if (userRole !== 'cliente') {
            return res.status(403).json({ message: "Solo los usuarios con rol de 'cliente' pueden tener un carrito." });
        }
        const cart = await cartModel.getCurrentCart(userId);

        return res.status(201).json(cart);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// agrega productos al carrito activo del usuario autenticado
// si no tiene carrito activo, crea uno nuevo
const addProductsToCart = async (req, res) => {
    const { userId } = req;
    try {
        const currentCart = await cartModel.getCurrentCart(userId);
        if (!currentCart) {
            // crear un nuevo carrito
            return await createCart(req, res);
        }
        const { products: newProducts } = req.body; // products con forma [{id, qty}, ...]

        // verificar que los productos que se quieren agregar ya existen en el carrito
        const updatedProducts = [...currentCart.products];
        // Usar for...of para awaitear correctamente las llamadas asíncronas
        for (const p of newProducts) {

            const productInfo = await productModel.findById(p.id);

            if (!productInfo) {
                return res.status(404).json({ message: `El producto con ID ${p.id} no existe.` });
            }

            const existingProductIndex = updatedProducts.findIndex(up => up.product.id === p.id);
            let totalQty = p.qty;

            if (existingProductIndex !== -1) {
                totalQty += updatedProducts[existingProductIndex].qty;
            }

            if (totalQty > productInfo.stock) {
                return res.status(400).json({
                    message: `Stock insuficiente para ${productInfo.name}. Disponible: ${productInfo.stock}, Solicitado: ${totalQty}`
                });
            }

            if (existingProductIndex !== -1) {
                updatedProducts[existingProductIndex].qty += p.qty;
                updatedProducts[existingProductIndex].subtotal = updatedProducts[existingProductIndex].product.price * updatedProducts[existingProductIndex].qty;
            } else {
                // agregar nuevo producto al carrito
                const productPrice = await productModel.getProductsPriceByIds([p.id]);
                updatedProducts.push({
                    product: {
                        id: p.id,
                        price: productPrice[0].price
                    },
                    qty: p.qty,
                    subtotal: productPrice[0].price * p.qty
                });
            }
        }

        // recalcular subtotal, iva y total
        const subtotal = updatedProducts.reduce((acumulador, item) => acumulador + item.subtotal, 0);
        const iva = parseFloat((subtotal * 0.16).toFixed(2));
        const total = parseFloat((subtotal + iva).toFixed(2));

        const updatedCartData = {
            products: updatedProducts,
            subtotal,
            iva,
            total
        };

        const updatedCart = await cartModel.updateCart(currentCart.id, updatedCartData);

        if (!updatedCart) {
            return res.status(500).json({ message: "Error al actualizar el carrito." });
        }

        return res.status(200).json(updatedCart);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const updateQtyProductInCart = async (req, res) => {
    const { userId } = req;
    const { productId } = req.params;
    const { qty } = req.body;

    if (!qty || qty <= 0) {
        return res.status(400).json({ message: "La cantidad debe ser un número mayor a 0." });
    }

    try {
        const currentCart = await cartModel.getCurrentCart(userId);
        if (!currentCart) {
            return res.status(404).json({ message: "No se encontró un carrito activo para el usuario." });
        }
        const updatedProducts = [...currentCart.products];
        const existingProductIndex = updatedProducts.findIndex(up => up.product.id === productId);
        if (existingProductIndex === -1) {
            return res.status(404).json({ message: "El producto que intentas actualizar no existe en tu carrito." });
        }

        const productInfo = await productModel.findById(productId);

        if (!productInfo) {
            // Caso raro: el producto estaba en el carrito pero fue borrado de la tienda
            return res.status(404).json({ message: "El producto ya no se encuentra disponible en la tienda." });
        }

        if (qty > productInfo.stock) {
            return res.status(400).json({
                message: `Stock insuficiente. Solo quedan ${productInfo.stock} unidades disponibles de este producto.`
            });
        }

        updatedProducts[existingProductIndex].qty = qty;
        updatedProducts[existingProductIndex].subtotal = updatedProducts[existingProductIndex].product.price * qty;
        // recalcular subtotal, iva y total
        const subtotal = updatedProducts.reduce((acumulador, item) => acumulador + item.subtotal, 0);
        const iva = parseFloat((subtotal * 0.16).toFixed(2));
        const total = parseFloat((subtotal + iva).toFixed(2));
        const updatedCartData = {
            products: updatedProducts,
            subtotal,
            iva,
            total
        };
        const updatedCart = await cartModel.updateCart(currentCart.id, updatedCartData);
        if (!updatedCart) {
            return res.status(500).json({ message: "Error al actualizar el carrito." });
        }
        return res.status(200).json(updatedCart);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const removeProductFromCart = async (req, res) => {
    const { userId } = req;
    const { productId } = req.params;
    try {
        const currentCart = await cartModel.getCurrentCart(userId);
        if (!currentCart) {
            return res.status(404).json({ message: "No se encontró un carrito activo para el usuario." });
        }
        const updatedProducts = currentCart.products.filter(p => p.product.id !== productId);
        // recalcular subtotal, iva y total
        const subtotal = updatedProducts.reduce((acumulador, item) => acumulador + item.subtotal, 0);
        const iva = parseFloat((subtotal * 0.16).toFixed(2));
        const total = parseFloat((subtotal + iva).toFixed(2));
        const updatedCartData = {
            products: updatedProducts,
            subtotal,
            iva,
            total
        };
        const updatedCart = await cartModel.updateCart(currentCart.id, updatedCartData);
        if (!updatedCart) {
            return res.status(500).json({ message: "Error al actualizar el carrito." });
        }
        return res.status(200).json(updatedCart);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const clearCart = async (req, res) => {
    const { userId } = req;
    try {
        const currentCart = await cartModel.getCurrentCart(userId);
        if (!currentCart) {
            return res.status(404).json({ message: "No se encontró un carrito activo para el usuario." });
        }
        const updatedCartData = {
            products: [],
            subtotal: 0,
            iva: 0,
            total: 0
        };
        const updatedCart = await cartModel.updateCart(currentCart.id, updatedCartData);
        if (!updatedCart) {
            return res.status(500).json({ message: "Error al actualizar el carrito." });
        }
        return res.status(200).json(updatedCart);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const payCart = async (req, res) => {
    const { userId, userRole, userMail } = req;

    try {
        const currentCart = await cartModel.getCurrentCart(userId);
        if (!currentCart) {
            return res.status(404).json({ message: "No hay carrito pendiente de pago." });
        }

        if (currentCart.products.length === 0) {
            return res.status(400).json({ message: "El carrito está vacío." });
        }

        const itemsForInvoice = [];
        const itemsForEmail = [];

        for (const item of currentCart.products) {
            const product = await productModel.findById(item.product.id);
            if (!product || product.stock < item.qty) {
                return res.status(400).json({
                    message: `Lo sentimos, el producto ${product.name} ya no tiene stock suficiente. Actualiza tu carrito.`
                });
            }

            if (!product.id_facturapi) {
                return res.status(400).json({
                    message: `El producto ${product.name} no está configurado para facturación.`
                });
            }

            itemsForEmail.push({
                infoProductBD: product,
                subtotal: item.subtotal,
                qty: item.qty
            });

            // Preparamos el item para la factura
            itemsForInvoice.push({
                productId: product.id_facturapi, // ID de Facturapi
                qty: item.qty
            });
        }

        // intento de pago usando Stripe
        const paymentIntent = await createPaymentIntent(userId, currentCart.id, currentCart.total);

        if (!paymentIntent) {
            return res.status(500).json({ message: "Error al iniciar el proceso de pago." });
        }

        // descontar stock en la BD
        for (const item of currentCart.products) {
            const product = await productModel.findById(item.product.id);
            const newStock = product.stock - item.qty;
            await productModel.updateProduct(item.product.id, { stock: newStock });
        }

        // generar factura con facturapi
        const factura = await createFacturapiInvoice(currentCart.user.id_facturapi, itemsForInvoice);

        let invoicePaths = { pdfUrl: null, xmlUrl: null };

        if (factura) {
            // generar PDF y XML de la factura
            const savedFiles = await downloadAndSaveInvoice(factura.id);
            if (savedFiles) {
                invoicePaths = savedFiles;
            }
        }

        // cerrar el carrito (Establecer paidAt)
        const updatedCart = await cartModel.updateCart(currentCart.id, {
            paidAt: new Date(),
            id_stripe: paymentIntent.id,
            id_facturapi: factura ? factura.id : null,
            // guardamos las rutas
            invoice_pdf: invoicePaths.pdfUrl,
            invoice_xml: invoicePaths.xmlUrl
        });

        // enviar correo de confirmación con twilio con archivos de factura adjuntos
        sendOrderConfirmation(userMail, updatedCart, invoicePaths, itemsForEmail);

        

        const responseData = {
            message: "Pago realizado con éxito.",
            cart: updatedCart,
            paymentIntent,
            facturaStatus: factura ? "created" : "failed",
            invoice_pdf: invoicePaths.pdfUrl,
            invoice_xml: invoicePaths.xmlUrl
        };

        return res.status(200).json(responseData);

    } catch (error) {
        console.error("Error en payCart:", error);
        return res.status(500).json({ message: error.message });
    }
}

export default {
    createCart,
    getCurrentCart,
    getAllCarts,
    addProductsToCart,
    updateQtyProductInCart,
    removeProductFromCart,
    clearCart,
    payCart,
};  