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
  console.log("========== MESSAGE ==========");
console.log(req.body);
console.log("CONTENT:", req.body.content);
console.log("PDF LENGTH:", req.body.pdfText?.length);
console.log("PDF START:", req.body.pdfText?.slice(0, 200));
  console.log("🔥 MESSAGE ROUTE HIT");
  try {
    const message = req.body.message || req.body.content || "";
    const pdfText = req.body.pdfText || "";

    console.log("Request Body:", req.body);
    console.log("Message:", message);
    console.log("PDF TEXT LENGTH:", pdfText.length);
    console.log("PDF TEXT:", pdfText.slice(0, 500));

    const hasDocument = pdfText.trim().length > 0;

    const systemPrompt = `
You are Neurix AI.

LANGUAGE RULES:
- Reply in the same language as the user.
- If the user uses Roman Urdu, reply in Roman Urdu.
- If the user uses Urdu, reply in Urdu.
- If the user uses English, reply in English.

DOCUMENT MODE:
${
  hasDocument
    ? `
A document has been uploaded.

IMPORTANT:
- The uploaded document is your PRIMARY and AUTHORITATIVE source.
- Answer the user's question using ONLY the uploaded document.
- Do NOT ignore the document.
- Do NOT say that the document was not provided.
- Do NOT invent information that is not in the document.
- You may calculate or explain information that is directly present in the document.
- If the requested information cannot be found in the document, say exactly:

"I couldn't find that information in the uploaded document."

UPLOADED DOCUMENT:
-------------------
${pdfText}
-------------------
`
    : `
No document has been uploaded.
Answer the user normally.
`
}
`;

    console.log("DOCUMENT MODE:", hasDocument ? "ON" : "OFF");

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",

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

      temperature: 0.2,
    });

    console.log("Groq response received");

    const reply =
      completion.choices?.[0]?.message?.content ||
      "I couldn't generate a response.";

    console.log("AI REPLY:", reply);

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const words = reply.split(" ");

    for (const word of words) {
      res.write(
        `data: ${JSON.stringify({
          text: word + " ",
        })}\n\n`
      );

      await new Promise((resolve) => setTimeout(resolve, 30));
    }

    res.write(
      `data: ${JSON.stringify({
        done: true,
      })}\n\n`
    );

    res.end();
  } catch (error) {
    console.error("FULL ERROR:", error);

    if (!res.headersSent) {
      return res.status(500).json({
        error: error.message || "AI response failed",
      });
    }

    res.end();
  }
});

export default router;
