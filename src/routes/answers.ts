import {FastifyInstance} from "fastify";
import {evaluateAnswers} from "../services/evaluationService.js";
import {fetchModelAnswers} from "../services/answerService.js";

export async function answerRoutes(fastify: FastifyInstance) {
    /**
     * @description Fetches answers from AI models for a given set of questions.
     * @route POST /answers/ask
     * @param {string[]} models - List of AI models to query.
     * @param {string[]} questions - List of questions to answer.
     * @returns {Object} An object containing answers from each model.
     */
    fastify.post("/ask", async (request, reply) => {
        const {models, questions} = request.body as { models: string[]; questions: string[] };

        if (!Array.isArray(models) || models.length === 0) {
            return reply.status(400).send({error: "At least one model is required"});
        }
        if (!Array.isArray(questions) || questions.length === 0) {
            return reply.status(400).send({error: "At least one question is required"});
        }

        const answers = await fetchModelAnswers(models, questions);
        return reply.send({answers});
    });

    /**
     * @description Evaluates the accuracy of answers given by AI models.
     * @route POST /answers/evaluate
     * @param {string[]} models - List of AI models used for evaluation.
     * @param {Record<string, Record<string, string>>} answers - Answers to evaluate.
     * @returns {Object} An object containing evaluation scores and feedback.
     */
    fastify.post("/evaluate", async (request, reply) => {
        const {models, answers} = request.body as {
            models: string[];
            answers: Record<string, Record<string, string>>;
        };

        if (!Array.isArray(models) || models.length === 0) {
            return reply.status(400).send({error: "At least one model is required"});
        }
        if (!answers || typeof answers !== "object" || Object.keys(answers).length === 0) {
            return reply.status(400).send({error: "Answers are required for evaluation"});
        }

        const evaluations = await evaluateAnswers(models, answers);
        return reply.send({evaluations});
    });
}
