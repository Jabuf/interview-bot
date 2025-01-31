import prompts from "../config/prompts.json" assert { type: "json" };

type PromptKeys = keyof typeof prompts;

/**
 * Retrieves a formatted prompt with placeholders replaced.
 * @param key - The key from prompts.json
 * @param replacements - An object containing placeholder values
 * @returns The formatted prompt string
 */
export function getPrompt(key: PromptKeys, replacements: Record<string, string>) {
  let prompt = prompts[key];

  if (!prompt) {
    throw new Error(`Prompt key "${key}" not found.`);
  }

  for (const [placeholder, value] of Object.entries(replacements)) {
    prompt = prompt.replace(`{${placeholder}}`, value);
  }

  return prompt;
}
