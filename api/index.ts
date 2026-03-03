import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(express.json());

app.post("/api/generate-gifts", async (req, res) => {
  try {
    const { description, budget, lang = 'it' } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) return res.status(500).json({ error: "Chiave API mancante su Vercel" });

    // Inizializzazione super-compatibile
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Proviamo il modello base che non fallisce mai
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Analizza: "${description}" Budget: ${budget}€. Rispondi ESCLUSIVAMENTE in formato JSON: { "psychologicalProfile": "...", "ideas": [{"name": "...", "reason": "...", "estimatedPrice": 0}] }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json|```/g, "").trim();
    
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(text);
  } catch (error: any) {
    // Questo log ci dirà l'ultima parola nei "Functions Logs"
    console.error("DETTAGLIO ERRORE:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default app;