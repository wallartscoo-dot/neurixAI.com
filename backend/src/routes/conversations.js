import { Router } from "express";
import { prisma } from "../prisma.js";
import { requireAuth } from "../middleware/auth.js";

export const conversationsRouter = Router();
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
