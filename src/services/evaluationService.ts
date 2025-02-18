import ollama from "ollama";
import {getPrompt} from "../utils/promptUtils.js";
import {parseModelResponse} from "../utils/jsonUtils.js";
import {logger} from "../utils/logger.js";

/**
 * A single evaluation with score and feedback.
 */
type SingleEvaluation = {
    score: number;
    feedback: string;
};

/**
 * Represents the structure of a model's evaluations.
 * - The top-level key is the model performing the evaluation.
 * - The nested key is the model being evaluated.
 */
type ModelEvaluations = Record<
    string,
    Record<string, SingleEvaluation | { error: string }>
>;

/**
 * Shape of the JSON returned by an evaluator model.
 */
interface EvaluationsApiResponse {
    evaluations: Record<
        string,
        SingleEvaluation | Record<string, SingleEvaluation>
    >;
}

/**
 * Evaluate model answers using other models.
 * @param models The list of model names.
 * @param answers The object containing answers from each model.
 * @returns Evaluation scores and feedback per model, including execution times.
 */
export async function evaluateAnswers(
    models: string[],
    answers: Record<string, Record<string, string>>
) {
    const evaluations: ModelEvaluations = {};
    const evaluationTimes: Record<string, number> = {};

    await Promise.all(
        models.map(async (model) => {
            try {
                const prompt = getPrompt("evaluate_answers", {
                    answers: JSON.stringify(answers),
                });

                const startTime = performance.now();
                const response = await ollama.chat({
                    model,
                    messages: [{role: "user", content: prompt}],
                });
                const endTime = performance.now();

                const jsonResponse = parseModelResponse<EvaluationsApiResponse>(
                    response.message.content,
                    {evaluations: {}}
                );

                Object.assign(evaluations, jsonResponse.evaluations);
                evaluationTimes[model] = Math.round(endTime - startTime);

            } catch (error) {
                logger.error(`Error evaluating answers with ${model}:`, error);
                evaluations[model] = {
                    [model]: {error: `Error: ${(error as Error).message}`},
                };
                evaluationTimes[model] = -1;
            }
        })
    );

    return {evaluations, evaluationTimes};
}
