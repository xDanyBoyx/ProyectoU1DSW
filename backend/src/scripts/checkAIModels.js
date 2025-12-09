// backend/checkModels.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Para ejecutar el script hay que hardcodear la api key del .env acá abajo,
// porque por alguna razón dotenv no inyecta ninguna variable del .env xD
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("❌ No se encontró la GEMINI_API_KEY en las variables de entorno.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    console.log("🔍 Consultando modelos disponibles...");
    try {
        // Hacemos una petición directa a la API REST para listar modelos
        // ya que la librería a veces abstrae esto.
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.error) {
            console.error("❌ Error API:", data.error);
            return;
        }

        console.log("\n✅ Modelos disponibles para tu API Key:");
        console.log("---------------------------------------");
        const generateModels = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
        
        generateModels.forEach(m => {
            console.log(`- ${m.name.replace('models/', '')}`);
        });
        console.log("---------------------------------------");
        console.log("👉 Usa uno de estos nombres exactos en tu código.");

    } catch (error) {
        console.error("❌ Error al conectar:", error);
    }
}

listModels();