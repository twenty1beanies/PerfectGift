import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(express.json());

app.post("/api/generate-gifts", async (req, res) => {
  try {
    const { description, budget, lang = 'it' } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) return res.status(500).json({ error: "API Key missing" });

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Cambiamo in gemini-1.5-flash-8b: è il più compatibile con l'endpoint v1 attuale
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

    const prompt = `Sei un esperto di regali. Analizza: "${description}" Budget: ${budget}€. 
                    Rispondi SOLO con JSON in ${lang}: 
                    { "psychologicalProfile": "...", "ideas": [{"name": "...", "reason": "...", "estimatedPrice": 0}] }`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, "").trim();
    
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(text);
  } catch (error: any) {
    console.error("ERRORE CRITICO:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default app;