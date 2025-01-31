import {FastifyInstance} from "fastify";
import {fetchModelResponses} from "../../services/modelService.js";
import {evaluateAnswers} from "../../services/evaluationService.js";

export async function answerRoutes(fastify: FastifyInstance) {
    fastify.post("/ask", async (request, reply) => {
        const {models, question} = request.body as { models: string[]; question: string };

        if (!models || models.length === 0) {
            return reply.status(400).send({error: "At least one model is required"});
        }
        if (!question) {
            return reply.status(400).send({error: "Question is required"});
        }

        const responses = await fetchModelResponses(models, question);
        return reply.send({responses});
    });

    fastify.post("/evaluate", async (request, reply) => {
        const {models, answers} = request.body as { models: string[]; answers: Record<string, string[]> };

        if (!models || models.length === 0) {
            return reply.status(400).send({error: "At least one model is required"});
        }
        if (!answers || Object.keys(answers).length === 0) {
            return reply.status(400).send({error: "Answers are required for evaluation"});
        }

        const evaluations = await evaluateAnswers(models, answers);
        return reply.send({evaluations});
    });


}
