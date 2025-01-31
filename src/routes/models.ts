import { FastifyInstance } from "fastify";
import { fetchModelResponses } from "../services/modelService.js";

export async function modelRoutes(fastify: FastifyInstance) {
  fastify.post("/ask", async (request, reply) => {
    const { models, question } = request.body as { models: string[]; question: string };

    if (!models || models.length === 0) {
      return reply.status(400).send({ error: "At least one model is required" });
    }
    if (!question) {
      return reply.status(400).send({ error: "Question is required" });
    }

    const responses = await fetchModelResponses(models, question);
    return reply.send({ responses });
  });
}
