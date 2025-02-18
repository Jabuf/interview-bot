import {logger} from "./logger.js";
import {jsonrepair} from "jsonrepair";

/**
 * Cleans and parses a JSON response from a model.
 * Removes `<think>` sections and Markdown code blocks before parsing.
 *
 * @template T - The expected return type of the parsed JSON.
 * @param response - Raw model response string from the AI model.
 * @param fallback - Default structure to return in case of parsing failure.
 * @returns Parsed JSON object of type `T`, or the fallback if parsing fails.
 */
export function parseModelResponse<T>(response: string, fallback: T): T {
    // Remove <think>...</think> blocks
    response = response.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

    // Remove Markdown-style code blocks (```json ... ```)
    response = response.replace(/```json\s*([\s\S]*?)\s*```/g, "$1").trim();

    try {
        return JSON.parse(response) as T;
    } catch (error) {
        try {
            logger.warn({error, response}, "Initial JSON parse failed; attempting repair");
            const repaired = jsonrepair(response);
            return JSON.parse(repaired) as T;
        } catch (error) {
            logger.error({error, response}, "JSON parsing error");
            return fallback;
        }
    }
}
