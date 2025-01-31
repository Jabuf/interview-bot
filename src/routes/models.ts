import {FastifyInstance} from "fastify";
import {fetchMergedQuestions, fetchModelResponses} from "../services/modelService.js";
import {fetchModelAnswers} from "../services/answerService.js";
import {evaluateAnswers} from "../services/evaluationService.js";

export async function modelRoutes(fastify: FastifyInstance) {
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

    fastify.post("/generate-questions", async (request, reply) => {
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

    fastify.post("/answer-questions", async (request, reply) => {
        const {models, questions} = request.body as { models: string[]; questions: string[] };

        if (!models || models.length === 0) {
            return reply.status(400).send({error: "At least one model is required"});
        }
        if (!questions || questions.length === 0) {
            return reply.status(400).send({error: "At least one question is required"});
        }

        const answers = await fetchModelAnswers(models, questions);
        return reply.send({answers});
    });

    fastify.post("/evaluate-answers", async (request, reply) => {
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
