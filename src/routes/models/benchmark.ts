import {FastifyInstance} from "fastify";
import {runBenchmark} from "../../services/benchmarkService.js";

export async function benchmarkRoutes(fastify: FastifyInstance) {
  fastify.post("/", async (request, reply) => {
    const { models, topic } = request.body as { models: string[]; topic: string };

    if (!models || models.length === 0) {
      return reply.status(400).send({ error: "At least one model is required" });
    }
    if (!topic) {
      return reply.status(400).send({ error: "Topic is required" });
    }

    const result = await runBenchmark(models, topic);
    return reply.send(result);
  });
}
