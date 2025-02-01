import {fetchMergedQuestions} from "./questionService.js";
import {fetchModelAnswers} from "./answerService.js";
import {evaluateAnswers} from "./evaluationService.js";

/**
 * Runs the full benchmarking workflow.
 * @param models - List of selected models
 * @param topic - The topic to generate questions for
 * @returns The benchmarking results including questions, answers, and evaluations
 */
export async function runBenchmark(models: string[], topic: string) {
    // Step 1: Generate and merge questions
    const questionsByModel = await fetchMergedQuestions(models, topic);

    // Step 2: Flatten questions into a unique set for consistency
    const allQuestions = [...new Set(Object.values(questionsByModel).flat())];

    // Step 3: Get answers from each model
    const answers = await fetchModelAnswers(models, allQuestions);

    // Step 4: Evaluate the answers
    const evaluations = await evaluateAnswers(models, answers);

    return {
        topic,
        questionsByModel,
        mergedQuestions: allQuestions,
        answers,
        evaluations,
    };
}
