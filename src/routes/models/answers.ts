import {FastifyInstance} from "fastify";
import {evaluateAnswers} from "../../services/evaluationService.js";
import {fetchModelAnswers} from "../../services/answerService.js";

export async function answerRoutes(fastify: FastifyInstance) {
    fastify.post("/ask", async (request, reply) => {
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

    fastify.post("/evaluate", async (request, reply) => {
        const {models, answers} = request.body as {
            models: string[];
            answers: Record<string, Record<string, string>>;
        };

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
