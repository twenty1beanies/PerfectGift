import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(express.json());

// Endpoint per la generazione dei regali
app.post("/api/generate-gifts", async (req, res) => {
  try {
    const { description, budget, lang = 'it' } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "API Key mancante nelle variabili di ambiente di Vercel" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prompt ottimizzato per evitare testo extra fuori dal JSON
    const prompt = `Sei un esperto di regali. Analizza: "${description}" con Budget: ${budget}€. 
                    Rispondi ESCLUSIVAMENTE con un oggetto JSON in lingua ${lang}.
                    NON aggiungere spiegazioni fuori dal JSON.
                    Struttura richiesta: 
                    { 
                      "psychologicalProfile": "breve descrizione", 
                      "ideas": [{"name": "nome", "reason": "perché", "estimatedPrice": 0}] 
                    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Pulizia rigorosa per estrarre solo il contenuto JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      text = jsonMatch[0];
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(text);
  } catch (error: any) {
    console.error("Errore API Gemini:", error);
    res.status(500).json({ error: "Errore durante la generazione dei regali", details: error.message });
  }
});

export default app;