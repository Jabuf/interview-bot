import ollama from "ollama";
import {getPrompt} from "../utils/promptUtils.js";
import {parseModelResponse} from "../utils/jsonUtils.js";
import {logger} from "../utils/logger.js";

/**
 * Represents the structure of a model's answers.
 */
type ModelAnswers = {
    answers: Record<string, string>;
    timeTakenMs: number;
} | { error: string };

/**
 * Fetch answers from multiple models for a given set of questions.
 * @param models - List of model names
 * @param questions - Array of merged questions
 * @returns An object containing model responses and execution times
 */
export async function fetchModelAnswers(models: string[], questions: string[]) {
    const responses: Record<string, ModelAnswers> = {};

    await Promise.all(
        models.map(async (model) => {
            try {
                const prompt = getPrompt("answer_questions", {questions: JSON.stringify(questions)});

                const startTime = performance.now();
                const response = await ollama.chat({
                    model,
                    messages: [{role: "user", content: prompt}],
                });
                const endTime = performance.now();

                const jsonResponse = parseModelResponse<{ answers: Record<string, string> }>(
                    response.message.content,
                    {answers: {}}
                );

                if (jsonResponse.answers && typeof jsonResponse.answers === "object") {
                    responses[model] = {
                        answers: jsonResponse.answers,
                        timeTakenMs: Math.round(endTime - startTime),
                    };
                } else {
                    logger.error(`Unexpected JSON format from ${model}:`, jsonResponse);
                    responses[model] = {error: "Invalid response format"};
                }
            } catch (error) {
                logger.error(`Error fetching answers from ${model}:`, error);
                responses[model] = {error: `Error: ${(error as Error).message}`};
            }
        })
    );

    return responses;
}
