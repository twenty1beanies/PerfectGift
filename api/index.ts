import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(express.json());

app.post("/api/generate-gifts", async (req, res) => {
  try {
    const { description, budget, lang = 'it' } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) return res.status(500).json({ error: "API Key missing" });

    // FORZIAMO IL MODELLO FLASH (più leggero e veloce per Tier 1)
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Specifichiamo il modello esatto senza alias
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
    });

    const prompt = `Analizza: "${description}" Budget: ${budget}€. Rispondi SOLO in JSON: { "psychologicalProfile": "...", "ideas": [{"name": "...", "reason": "...", "estimatedPrice": 0}] }`;

    // Aggiungiamo un timeout manuale per evitare che Vercel chiuda la connessione
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, "").trim();
    
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(text);
  } catch (error: any) {
    console.error("DETTAGLIO ERRORE:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default app;
