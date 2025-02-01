import {mergeQuestions} from "./questionMerger.js";
import ollama from "ollama";
import {getPrompt} from "../utils/promptUtils.js";

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

                // Splitting responses into multiple questions (assuming newline-separated)
                // TODO json
                const questions = response.message.content.split("\n").map((q) => q.trim()).filter(Boolean);
                questionLists.push(questions);
            } catch (error) {
                console.error(`Error fetching questions from ${model}:`, error);
            }
        })
    );

    return mergeQuestions(questionLists);
}
