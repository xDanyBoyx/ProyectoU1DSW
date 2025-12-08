import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (idCustomer, idCart, total) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(total * 100), // Convertir a centavos
            currency: 'mxn', 
            payment_method_types: ['card'], // Métodos de pago permitidos
            description: `Pago por carrito #${idCart}`,
            metadata: {
                idCart: idCart.toString(),
                idCustomer: idCustomer.toString(),
            },
        });
        return paymentIntent;
    } catch (error) {
        console.error('❌ Error al procesar pago con Stripe: ', error);
        return null;
    }
}