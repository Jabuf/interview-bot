import { FastifyInstance } from "fastify";
import { askOllama } from './../utils/ollama.js';

export async function botRoutes(fastify: FastifyInstance) {
  fastify.post("/ask", async (request, reply) => {
    const { question } = request.body as { question: string };
    if (!question) {
      return reply.status(400).send({ error: "Question is required" });
    }

    const answer = await askOllama(question);
    return reply.send({ answer });
  });
}
