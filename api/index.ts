import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(express.json());

app.post("/api/generate-gifts", async (req, res) => {
  try {
    const { description, budget, lang = 'it' } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "API Key mancante su Vercel" });
    }

    // Usiamo esplicitamente il modello "gemini-pro" o "gemini-1.5-flash" senza alias
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Prova ad usare "gemini-1.5-flash" o "gemini-pro" che sono i più stabili
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Sei un esperto di regali. Analizza: "${description}" con Budget: ${budget}€. 
                    Rispondi ESCLUSIVAMENTE con un oggetto JSON in lingua ${lang}.
                    NON aggiungere markdown o spiegazioni.
                    Struttura: { "psychologicalProfile": "...", "ideas": [{"name": "...", "reason": "...", "estimatedPrice": 0}] }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    
    // Rimuove eventuali blocchi di codice markdown se Gemini li inserisce
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(text);
  } catch (error: any) {
    console.error("Errore dettagliato:", error);
    // Restituiamo l'errore completo per vederlo nei log di Vercel
    res.status(500).json({ 
      error: "Errore Gemini", 
      message: error.message,
      status: error.status 
    });
  }
});

export default app;