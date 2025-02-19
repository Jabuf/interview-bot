import {FastifyInstance} from "fastify";
import {fetchMergedQuestions} from "../../services/questionService.js";
import {logger} from "../../utils/logger.js";

export async function questionRoutes(fastify: FastifyInstance) {
    fastify.post("/generate", async (request, reply) => {
        try {
            const {models, num_questions, topic} = request.body as {
                models: string[];
                num_questions?: number;
                topic: string;
            };

            if (!Array.isArray(models) || models.length === 0) {
                return reply.status(400).send({error: "At least one model is required"});
            }
            if (!topic) {
                return reply.status(400).send({error: "Topic is required and must be a string"});
            }

            const questions = await fetchMergedQuestions(models, topic, num_questions);

            if (!questions || Object.keys(questions).length === 0) {
                return reply.status(500).send({error: "Failed to generate questions"});
            }

            return reply.send({questions});
        } catch (error) {
            logger.error({error}, "Unexpected error in /generate");
            return reply.status(500).send({error: "Internal server error"});
        }
    });
}
