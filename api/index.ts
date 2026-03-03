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
    
    // USIAMO PRO: È l'unico garantito al 100% su tutti gli endpoint v1
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `Analizza: "${description}" Budget: ${budget}€. Rispondi SOLO in JSON: { "psychologicalProfile": "...", "ideas": [{"name": "...", "reason": "...", "estimatedPrice": 0}] }`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, "").trim();
    
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(text);
  } catch (error: any) {
    console.error("LOG ERRORE:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default app;