import ollama from "ollama";
import { getPrompt } from "../utils/promptUtils.js";

/**
 * Evaluates answers using multiple models.
 * Each model receives all answers (including its own) for evaluation.
 * @param models - List of model names
 * @param answers - Object containing answers from each model
 * @returns Evaluation results with scores and feedback
 */
export async function evaluateAnswers(models: string[], answers: Record<string, string[]>) {
  const evaluations: Record<string, Record<string, { score: number; feedback: string }>> = {};

  await Promise.all(
    models.map(async (evaluator) => {
      try {
        // Construct the evaluation prompt
        const formattedAnswers = Object.entries(answers)
          .map(([model, modelAnswers]) => `${model}:\n${modelAnswers.join("\n")}`)
          .join("\n\n");

        const prompt = getPrompt("evaluate_answers", { answers: formattedAnswers });

        const response = await ollama.chat({
          model: evaluator,
          messages: [{ role: "user", content: prompt }],
        });

        // Expecting the response to be in JSON format with scores & feedback
        evaluations[evaluator] = JSON.parse(response.message.content);
      } catch (error) {
        evaluations[evaluator] = { error: { score: 0, feedback: `Error: ${(error as Error).message}` } };
      }
    })
  );

  return evaluations;
}
