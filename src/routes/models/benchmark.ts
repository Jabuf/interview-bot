import {FastifyInstance} from "fastify";
import {runBenchmark} from "../../services/benchmarkService.js";
import {logger} from "../../utils/logger.js";

export async function benchmarkRoutes(fastify: FastifyInstance) {
    fastify.post("/", async (request, reply) => {
        try {
            const {models, topic, num_questions} = request.body as {
                models: string[];
                topic: string;
                num_questions?: number;
            };

            if (!Array.isArray(models) || models.length === 0) {
                return reply.status(400).send({error: "At least one model is required"});
            }
            if (!topic) {
                return reply.status(400).send({error: "Topic is required and must be a string"});
            }

            const result = await runBenchmark(models, topic, num_questions);

            if (!result) {
                return reply.status(500).send({error: "Benchmark execution failed"});
            }

            return reply.send(result);
        } catch (error) {
            logger.error({error}, "Unexpected error in benchmark route");
            return reply.status(500).send({error: "Internal server error"});
        }
    });
}
