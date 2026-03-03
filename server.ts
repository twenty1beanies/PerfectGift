import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // API Route for generating gifts (Secure Backend)
  app.post("/api/generate-gifts", async (req, res) => {
    try {
      const { description, budget, history, isRegenerate, lang = 'it' } = req.body;

      if (!description) {
        return res.status(400).json({ error: "Description is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API key is not configured" });
      }

      const ai = new GoogleGenAI({ apiKey });
      const model = "gemini-3-flash-preview";

      const prompt = `
        Sei un Esperto internazionale di psicologia dei consumi e Personal Shopper di alto livello.
        Il tuo compito è analizzare profondamente la descrizione del destinatario fornita e suggerire i regali perfetti.
        
        Descrizione del destinatario: "${description}"
        Budget massimo: ${budget}€
        Lingua di risposta: ${lang.toUpperCase()} (DEVI RISPONDERE ESCLUSIVAMENTE IN QUESTA LINGUA).
        
        ${isRegenerate ? `IMPORTANTE: Ho già suggerito i seguenti prodotti: ${history.join(', ')}. NON suggerire questi prodotti o varianti troppo simili. Fornisci 6 NUOVE idee originali e diverse dalle precedenti.` : 'Fornisci 6 idee regalo uniche e mirate.'}

        Richieste specifiche per il formato JSON:
        1. "psychologicalProfile": Crea un profilo empatico, accurato e profondo (max 500 caratteri). Non limitarti a riassumere la descrizione; spiega la psicologia dietro i suggerimenti. Spiega PERCHÉ questi regali si adattano alla personalità, ai desideri o allo stile di vita del destinatario.
        2. "ideas": Un array di 6 oggetti, ognuno con:
           - "name": Nome specifico e accattivante del prodotto.
           - "reason": Una spiegazione dettagliata e persuasiva del perché questo oggetto è perfetto, collegandolo al profilo psicologico.
           - "estimatedPrice": Un prezzo stimato realistico in Euro, che deve essere assolutamente entro il budget di ${budget}€.

        Assicurati che i suggerimenti siano prodotti reali e facilmente reperibili online.
      `;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              psychologicalProfile: { type: Type.STRING },
              ideas: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    reason: { type: Type.STRING },
                    estimatedPrice: { type: Type.NUMBER }
                  },
                  required: ["name", "reason", "estimatedPrice"]
                }
              }
            },
            required: ["psychologicalProfile", "ideas"]
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      res.json(data);
    } catch (error: any) {
      console.error("Error generating gifts:", error);
      res.status(500).json({ error: "Failed to generate gifts", details: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    // Catch-all route for SPA
    app.get("*", (req, res) => {
      res.sendFile("index.html", { root: "dist" });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
