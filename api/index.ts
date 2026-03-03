import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(express.json());

// Endpoint esatto chiamato dal tuo frontend
app.post("/api/generate-gifts", async (req, res) => {
  try {
    const { description, budget, lang = 'it' } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) return res.status(500).json({ error: "API Key mancante su Vercel" });

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Analizza: "${description}" Budget: ${budget}€. Rispondi in ${lang}. 
                    Formatta come JSON: { "psychologicalProfile": "...", "ideas": [{"name": "...", "reason": "...", "estimatedPrice": 0}] }`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, "");
    
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(text);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default app;