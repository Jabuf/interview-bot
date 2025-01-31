import ollama from "ollama";
import { getPrompt } from "../utils/promptUtils.js";

/**
 * Fetch answers from multiple models for a given set of questions.
 * @param models - List of model names
 * @param questions - Array of merged questions
 * @returns An object containing model responses
 */
export async function fetchModelAnswers(models: string[], questions: string[]) {
  const responses: Record<string, string[]> = {};

  await Promise.all(
    models.map(async (model) => {
      try {
        const prompt = getPrompt("answer_questions", { questions: questions.join("\n") });

        const response = await ollama.chat({
          model,
          messages: [{ role: "user", content: prompt }],
        });

        responses[model] = response.message.content.split("\n"); // Convert response to array
      } catch (error) {
        responses[model] = [`Error: ${(error as Error).message}`];
      }
    })
  );

  return responses;
}
