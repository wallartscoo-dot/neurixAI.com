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
const message = req.body.message || req.body.content;

console.log("Request Body:", req.body);
console.log("Message:", message);

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "system",
          content: `
You are Neurix AI assistant.
Reply in the same language as the user.
If user writes Roman Urdu, reply in Roman Urdu.
If user writes English, reply in English.
`
        },
        {
          role: "user",
          content: message
        }
      ],

      temperature: 0.7
    });

    console.log("Groq response received");
console.log(completion);

    const reply = completion.choices[0].message.content;

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
