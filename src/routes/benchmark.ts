import {FastifyInstance} from "fastify";
import {runBenchmark} from "../services/benchmarkService.js";

export async function benchmarkRoutes(fastify: FastifyInstance) {
    /**
     * @description Runs a benchmark across multiple AI models.
     * @route POST /benchmark
     * @param {string[]} models - List of models to benchmark.
     * @param {string} topic - The topic to generate questions for.
     * @param {number} [num_questions] - (Optional) Number of questions to generate.
     * @returns {Object} The benchmark results.
     */
    fastify.post("/", async (request, reply) => {
        const {models, topic, num_questions} = request.body as {
            models: string[];
            topic: string;
            num_questions?: number;
        };

        if (!Array.isArray(models) || models.length === 0) {
            return reply.status(400).send({error: "At least one model is required"});
        }
        if (!topic.trim()) {
            return reply.status(400).send({error: "Topic is required and must be a non-empty string"});
        }

        const result = await runBenchmark(models, topic, num_questions);
        return reply.send(result);
    });
}
