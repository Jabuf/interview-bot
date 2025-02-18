import ollama from "ollama";
import {getPrompt} from "../utils/promptUtils.js";
import {parseModelResponse} from "../utils/jsonUtils.js";

/**
 * Represents the structure of a model's evaluations.
 */
type ModelEvaluations = Record<string, { score: number; feedback: string }> | { error: string };

/**
 * Evaluate model answers using other models.
 * @param models - List of model names
 * @param answers - Object containing answers from each model
 * @returns Evaluation scores and feedback per model, including execution times
 */
export async function evaluateAnswers(models: string[], answers: Record<string, Record<string, string>>) {
    const evaluations: Record<string, ModelEvaluations> = {};
    const evaluationTimes: Record<string, number> = {}; // Track evaluation duration

    await Promise.all(
        models.map(async (model) => {
            try {
                const prompt = getPrompt("evaluate_answers", {answers: JSON.stringify(answers)});

                const startTime = performance.now();
                const response = await ollama.chat({
                    model,
                    messages: [{role: "user", content: prompt}],
                });
                const endTime = performance.now();

                const jsonResponse = parseModelResponse<{
                    evaluations: Record<string, { score: number; feedback: string }>;
                }>(response.message.content, {evaluations: {}});

                if (jsonResponse.evaluations && typeof jsonResponse.evaluations === "object") {
                    evaluations[model.toLowerCase()] = Object.fromEntries(
                        Object.entries(jsonResponse.evaluations).map(([evaluatedModel, evaluation]) => [
                            evaluatedModel.toLowerCase(),
                            evaluation,
                        ])
                    );

                    evaluationTimes[model.toLowerCase()] = Math.round(endTime - startTime);
                } else {
                    console.error(`Unexpected JSON format from ${model}:`, jsonResponse);
                    evaluations[model.toLowerCase()] = {error: "Invalid response format"};
                    evaluationTimes[model.toLowerCase()] = -1; // Error marker
                }
            } catch (error) {
                console.error(`Error evaluating answers with ${model}:`, error);
                evaluations[model.toLowerCase()] = {error: `Error: ${(error as Error).message}`};
                evaluationTimes[model.toLowerCase()] = -1;
            }
        })
    );

    return {evaluations, evaluationTimes};
}
