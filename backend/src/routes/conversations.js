import { Router } from "express";
import { prisma } from "../prisma.js";
import { requireAuth } from "../middleware/auth.js";
import Groq from "groq-sdk";

export const conversationsRouter = Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

conversationsRouter.use(requireAuth);

conversationsRouter.get("/", async (req, res) => {
  const conversations = await prisma.conversation.findMany({
    where: { userId: req.userId },
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, createdAt: true, updatedAt: true },
  });
  res.json(conversations);
});

conversationsRouter.post("/", async (req, res) => {
  const conversation = await prisma.conversation.create({
    data: { userId: req.userId, title: "New chat" },
  });
  res.json(conversation);
});

conversationsRouter.delete("/:id", async (req, res) => {
  await prisma.conversation.deleteMany({
    where: { id: req.params.id, userId: req.userId },
  });
  res.json({ ok: true });
});

conversationsRouter.patch("/:id", async (req, res) => {
  const { title } = req.body;
  const conversation = await prisma.conversation.updateMany({
    where: { id: req.params.id, userId: req.userId },
    data: { title },
  });
  res.json({ ok: conversation.count > 0 });
});

conversationsRouter.get("/:id/messages", async (req, res) => {
  const conversation = await prisma.conversation.findFirst({
    where: { id: req.params.id, userId: req.userId },
  });
  if (!conversation) return res.status(404).json({ error: "Conversation not found" });

  const messages = await prisma.message.findMany({
    where: { conversationId: req.params.id },
    orderBy: { createdAt: "asc" },
  });
  res.json(messages);
});
conversationsRouter.post("/:id/messages", async (req, res) => {
  try {
    const message = req.body.content;

    await prisma.message.create({
      data: {
        conversationId: req.params.id,
        role: "user",
        content: message,
      },
    });

    const previousMessages = await prisma.message.findMany({
  where: {
    conversationId: req.params.id,
  },
  orderBy: {
    createdAt: "asc",
  },
});

const aiMessages = [
  {
    role: "system",
    content: `
You are Neurix AI assistant.
Reply in the same language as the user.
If user writes Roman Urdu, reply in Roman Urdu.
If user writes English, reply in English.
`,
  },

  ...previousMessages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  })),
];
    const completion = await groq.chat.completions.create({
  model: "llama-3.3-70b-versatile",
  stream: true,
  messages: aiMessages,
});

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let fullReply = "";

    for await (const chunk of completion) {
      const text = chunk.choices[0]?.delta?.content || "";

      if (text) {
        fullReply += text;

        res.write(
          `data: ${JSON.stringify({ text })}\n\n`
        );
      }
    }

    await prisma.message.create({
      data: {
        conversationId: req.params.id,
        role: "assistant",
        content: fullReply,
      },
    });

    res.write(
      `data: ${JSON.stringify({ done: true })}\n\n`
    );

    res.end();

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "AI response failed",
    });
  }
});
