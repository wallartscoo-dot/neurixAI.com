import { Router } from "express";
import Groq from "groq-sdk";

const router = Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.get("/", (req, res) => {
  res.json({ message: "Messages route is working" });
});

router.post("/", async (req, res) => {
  try {
    const message = req.body.message || req.body.content || "";
    const pdfText = req.body.pdfText || "";

    console.log("Request Body:", req.body);
    console.log("Message:", message);

    const systemPrompt = `
You are Neurix AI.

Reply in the same language as the user.

- If the user writes in Roman Urdu, reply in Roman Urdu.
- If the user writes in English, reply in English.

If an uploaded PDF is provided, answer ONLY from that PDF.

Rules:
1. Do NOT invent information.
2. If the answer exists in the PDF, answer clearly.
3. If the answer is NOT in the PDF, reply:
"I couldn't find that information in the uploaded PDF."

Uploaded PDF:
${pdfText}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const words = reply.split(" ");

    for (const word of words) {
      res.write(`data: ${JSON.stringify({ text: word + " " })}\n\n`);
      await new Promise((resolve) => setTimeout(resolve, 30));
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error) {
    console.error("FULL ERROR:", error);

    res.status(500).json({
      error: error.message || "AI response failed",
    });
  }
});

export default router;
