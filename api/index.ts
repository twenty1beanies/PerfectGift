import express from "express";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

app.post("/api/generate-gifts", async (req, res) => {
  try {
    const { description, budget, history, isRegenerate, lang = 'it' } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Gemini API key is not configured" });
    }

    const ai = new GoogleGenAI({ apiKey });
    // Usiamo Gemini 1.5 Flash, che è stabile e veloce per questo compito
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" }); 

    const prompt = `
        Sei un Esperto internazionale di psicologia dei consumi e Personal Shopper di alto livello.
        Il tuo compito è analizzare profondamente la descrizione del destinatario fornita e suggerire i regali perfetti.
        
        Descrizione del destinatario: "${description}"
        Budget massimo: ${budget}€
        Lingua di risposta: ${lang.toUpperCase()} (DEVI RISPONDERE ESCLUSIVAMENTE IN QUESTA LINGUA).
        
        ${isRegenerate ? `IMPORTANTE: Ho già suggerito i seguenti prodotti: ${history.join(', ')}. NON suggerire questi prodotti o varianti troppo simili. Fornisci 6 NUOVE idee originali e diverse dalle precedenti.` : 'Fornisci 6 idee regalo uniche e mirate.'}

        Richieste specifiche per il formato JSON:
        1. "psychologicalProfile": Crea un profilo empatico, accurato e profondo (max 500 caratteri).
        2. "ideas": Un array di 6 oggetti (name, reason, estimatedPrice).
      `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const data = JSON.parse(result.response.text());
    res.json(data);
  } catch (error: any) {
    console.error("Errore API:", error);
    res.status(500).json({ error: "Failed to generate gifts", details: error.message });
  }
});

export default app;