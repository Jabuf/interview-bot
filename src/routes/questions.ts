import {FastifyInstance} from "fastify";
import {fetchMergedQuestions} from "../services/questionService.js";

export async function questionRoutes(fastify: FastifyInstance) {
    /**
     * @description Generates a set of questions based on a given topic using multiple AI models.
     * @route POST /questions/generate
     * @param {string[]} models - List of AI models to use for question generation.
     * @param {number} [num_questions=5] - (Optional) Number of questions to generate (default is 5, max is 15).
     * @param {string} topic - The topic for question generation.
     * @returns {Object} An object containing generated questions from each model.
     */
    fastify.post("/generate", async (request, reply) => {
        const {models, num_questions, topic} = request.body as {
            models: string[];
            num_questions?: number;
            topic: string;
        };

        if (!Array.isArray(models) || models.length === 0) {
            return reply.status(400).send({error: "At least one model is required"});
        }
        if (!topic.trim()) {
            return reply.status(400).send({error: "Topic is required and must be a non-empty string"});
        }

        const questions = await fetchMergedQuestions(models, topic, num_questions);

        return reply.send({questions});
    });
}
