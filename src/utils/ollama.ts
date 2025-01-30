import ollama from "ollama";

/**
 * Sends a prompt to the Ollama model and returns the response.
 * @param prompt The question or message to send.
 * @returns The model's response.
 */
export async function askOllama(prompt: string): Promise<string> {
  const response = await ollama.chat({
    model: "deepseek-r1",
    messages: [{ role: "user", content: prompt }]
  });

  return response.message.content;
}
