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
    const rawAnswers = await fetchModelAnswers(models, allQuestions);

    const answers: Record<string, Record<string, string>> = {};
    const answerTimes: Record<string, number> = {};

    for (const [model, response] of Object.entries(rawAnswers)) {
        if ("answers" in response) {
            answers[model] = response.answers;
            answerTimes[model] = response.timeTakenMs;
        } else {
            answers[model] = {};
            answerTimes[model] = -1; // Indicates an error occurred
        }
    }

    // Step 4: Evaluate the answers
    const {evaluations, evaluationTimes} = await evaluateAnswers(models, answers);

    return {
        topic,
        questionsByModel,
        mergedQuestions: allQuestions,
        answers,
        executionTimes: {
            answers: answerTimes,
            evaluations: evaluationTimes,
        },
        evaluations,
    };
}
