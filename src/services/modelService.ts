import ollama from "ollama";

export async function fetchModelResponses(models: string[], question: string) {
    const responses: Record<string, string> = {};

    await Promise.all(
        models.map(async (model) => {
            try {
                const response = await ollama.chat({
                    model,
                    messages: [{role: "user", content: question}],
                });
                responses[model] = response.message.content;
            } catch (error) {
                if (error instanceof Error) {
                    responses[model] = `Error: ${error.message}`;
                } else {
                    responses[model] = "An unknown error occurred.";
                }
            }
        })
    );

    return responses;
}
