import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateOrderSMS = async (cart) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const productList = cart.products.map(p => 
            `${p.qty}x ${p.product.name}`
        ).join(", ");

        const prompt = `
            Actúa como Tiendas 3B. Genera un SMS para el cliente ${cart.user.name}.
            Info: Pedido confirmado. Total $${cart.total}. Items: ${productList}.
            Requisitos: Texto plano, muy breve (max 160 caracteres), tono útil."
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("🤖 mensaje para SMS generado por IA: ",text);
        
        return text ? text.trim() : `Tiendas 3B: Pedido confirmado por $${cart.total}.`;

    } catch (error) {
        console.error("❌ Error IA:", error);
        // Fallback simple por si se cae la red o la cuota
        return `Tiendas 3B: Hola ${cart.user.name}, tu pedido por $${cart.total} ha sido confirmado.`;
    }
};