import {logger} from "./logger.js";

/**
 * Cleans and parses a JSON response from a model.
 * Removes unnecessary `<think>...</think>` sections and attempts to parse the response.
 * If parsing fails, returns a provided fallback structure.
 *
 * @template T - The expected return type of the parsed JSON.
 * @param response - Raw model response string from the AI model.
 * @param fallback - Default structure to return in case of parsing failure.
 * @returns Parsed JSON object of type `T`, or the fallback if parsing fails.
 */
export function parseModelResponse<T>(response: string, fallback: T): T {
    // Remove <think>...</think> blocks
    response = response.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

    try {
        return JSON.parse(response) as T;
    } catch (error) {
        logger.error({error, response}, "JSON parsing error");
        return fallback;
    }
}
