import ollama from "ollama";
import {getPrompt} from "../utils/promptUtils.js";
import {mergeQuestions} from "./questionMerger.js";

/**
 * Fetch responses from multiple models using a formatted prompt.
 * @param models - List of model names
 * @param questions - The questions to be answered
 * @returns An object containing model responses
 */
export async function fetchModelResponses(models: string[], questions: string) {
    const responses: Record<string, string> = {};

    await Promise.all(
        models.map(async (model) => {
            try {
                const prompt = getPrompt("answer_questions", {questions});
                const response = await ollama.chat({
                    model,
                    messages: [{role: "user", content: prompt}],
                });
                responses[model] = response.message.content;
            } catch (error) {
                responses[model] = `Error: ${(error as Error).message}`;
            }
        })
    );

    return responses;
}

/**
 * Fetch questions from multiple models and merge them.
 * @param models - List of model names
 * @param topic - The topic for question generation
 * @returns A merged list of unique questions
 */
export async function fetchMergedQuestions(models: string[], topic: string) {
    const questionLists: string[][] = [];

    await Promise.all(
        models.map(async (model) => {
            try {
                const prompt = getPrompt("generate_questions", {topic});
                const response = await ollama.chat({
                    model,
                    messages: [{role: "user", content: prompt}],
                });
                questionLists.push(response.message.content.split("\n"));
            } catch (error) {
                console.error(`Error fetching questions from ${model}:`, error);
            }
        })
    );

    return mergeQuestions(questionLists);
}
