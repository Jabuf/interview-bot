import {FastifyInstance} from "fastify";
import {fetchMergedQuestions} from "../../services/modelService.js";

export async function questionRoutes(fastify: FastifyInstance) {
    fastify.post("/generate", async (request, reply) => {
        const {models, topic} = request.body as { models: string[]; topic: string };

        if (!models || models.length === 0) {
            return reply.status(400).send({error: "At least one model is required"});
        }
        if (!topic) {
            return reply.status(400).send({error: "Topic is required"});
        }

        const questions = await fetchMergedQuestions(models, topic);
        return reply.send({questions});
    });

}
