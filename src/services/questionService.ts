import ollama from "ollama";
import {getPrompt} from "../utils/promptUtils.js";
import {parseModelResponse} from "../utils/jsonUtils.js";
import {logger} from "../utils/logger.js";

/**
 * Fetch questions from multiple models and merge them.
 * @param models - List of model names
 * @param topic - The topic for question generation
 * @returns A merged list of unique questions with model mapping
 */
export async function fetchMergedQuestions(models: string[], topic: string) {
    const questionLists: Record<string, string[]> = {};

    await Promise.all(
        models.map(async (model) => {
            try {
                const prompt = getPrompt("generate_questions", {topic});
                const response = await ollama.chat({
                    model,
                    messages: [{role: "user", content: prompt}],
                });

                // Clean and parse response
                const jsonResponse = parseModelResponse(response.message.content, {questions: []});
                if (jsonResponse.questions && Array.isArray(jsonResponse.questions)) {
                    questionLists[model] = jsonResponse.questions.map((q: string) => q.trim());
                } else {
                    logger.error(`Unexpected JSON format from ${model}:`, jsonResponse);
                }
            } catch (error) {
                logger.error(`Error fetching questions from ${model}:`, error);
                questionLists[model] = [];
            }
        })
    );

    return questionLists;
}
