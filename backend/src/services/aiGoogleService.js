import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateOrderSMS = async (cart, detailedItems) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const productList = detailedItems.map(p => {
            const info = p.infoProductBD; 
            // Formato: "2x Laptop HP (Electrónica)"
            // Incluir la categoría ayuda a la IA a generar la frase de contexto
            return `${p.qty}x ${info.name} (${info.category})`;
        }).join(", ");

        const prompt = `
            Actúa como el sistema de notificaciones de "Tiendas 3B".
            Genera un mensaje SMS para el cliente.
            
            Datos del cliente:
            - Nombre completo: ${cart.user.name} (IMPORTANTE: En el saludo usa SOLO su primer nombre).
            - Total pagado: $${Number(cart.total).toFixed(2)}.
            - Artículos: ${productList}.

            Instrucciones de contenido:
            1. Saluda usando solo el primer nombre.
            2. Confirma el pedido y el total.
            3. Agrega una frase breve y creativa relacionada con el tipo de artículos comprados.
            4. Menciona que los detalles completos están en su correo.
            5. Usa UN solo emoji al final que coincida con la frase.

            Requisitos técnicos:
            - Longitud máxima: 160 caracteres.
            - Tono: Útil, cercano y profesional.
            - Salida: Devuelve únicamente el texto del mensaje final.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log(`🤖 mensaje SMS generado por IA: "${text}"`);
        
        return text ? text.trim() : `Tiendas 3B: Pedido confirmado por $${cart.total}.`;

    } catch (error) {
        console.error("❌ Error IA:", error);
        // Fallback simple por si se cae la red o la cuota
        return `Tiendas 3B: Hola ${cart.user.name}, tu pedido por $${cart.total} ha sido confirmado.`;
    }
};