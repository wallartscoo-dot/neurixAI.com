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
const pdfText = req.body.pdfText || "";
    
console.log("Request Body:", req.body);
console.log("Message:", message);
console.log("PDF TEXT LENGTH:", pdfText.length);
console.log("PDF TEXT:", pdfText.slice(0, 500));

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages: [
       {
  role: "system",
  content: `
You are Neurix AI, an intelligent AI assistant.

GENERAL RULES:
- Reply in the same language as the user.
- If the user writes in Roman Urdu, reply in Roman Urdu.
- If the user writes in Urdu, reply in Urdu.
- If the user writes in English, reply in English.
- Format answers using Markdown with headings, bullet points and tables where useful.

DOCUMENT MODE:

If an uploaded document is available below, treat it as the primary source of truth.

Your abilities include:
- Summarize the document.
- Explain any topic from the document.
- Answer questions using the document.
- Extract important points.
- Create notes.
- Create MCQs.
- Translate the document.
- Explain difficult concepts in simple language.

Rules:
- Never invent facts.
- Answer from the uploaded document whenever possible.
- If the answer is not present in the document, clearly say:
  "I couldn't find that information in the uploaded document."

Uploaded Document:

${pdfText}
`
},
        {
  role: "user",
  content: `
User Request:

${message}

If a document has been uploaded, use it to answer.
`
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
