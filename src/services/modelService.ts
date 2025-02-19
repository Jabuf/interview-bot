import {exec} from "child_process";
import {promisify} from "util";
import {logger} from "../utils/logger.js";

const execAsync = promisify(exec);

/**
 * List installed models and Ollama version.
 */
export async function listInstalledModels() {
    try {
        const {stdout: models} = await execAsync("ollama list");
        const {stdout: version} = await execAsync("ollama --version");

        return {
            ollama_version: version.trim(),
            installed_models: models.split("\n").filter(Boolean),
        };
    } catch (error) {
        logger.error({error}, "Error retrieving installed models");
        throw new Error("Failed to retrieve installed models");
    }
}

/**
 * List available models, optionally including all versions.
 */
export async function listAvailableModels(allVersions: boolean = false) {
    try {
        const {stdout: models} = await execAsync("ollama show");
        const {stdout: version} = await execAsync("ollama --version");

        const modelList = models.split("\n").filter(Boolean);

        if (!allVersions) {
            const uniqueModels = new Map();
            modelList.forEach((line) => {
                const [model] = line.split(":"); // Extract model name before versioning
                uniqueModels.set(model, line);
            });
            return {
                ollama_version: version.trim(),
                available_models: Array.from(uniqueModels.values()),
            };
        }

        return {
            ollama_version: version.trim(),
            available_models: modelList,
        };
    } catch (error) {
        logger.error({error}, "Error retrieving available models");
        throw new Error("Failed to retrieve available models");
    }
}

/**
 * Install a model using Ollama.
 */
export async function installModel(modelName: string) {
    try {
        const {stdout} = await execAsync(`ollama pull ${modelName}`);
        return {message: `Model '${modelName}' installed successfully`, output: stdout};
    } catch (error) {
        logger.error({error}, `Error installing model: ${modelName}`);
        throw new Error(`Failed to install model '${modelName}'`);
    }
}

/**
 * Remove a model using Ollama.
 */
export async function removeModel(modelName: string) {
    try {
        const {stdout} = await execAsync(`ollama rm ${modelName}`);
        return {message: `Model '${modelName}' removed successfully`, output: stdout};
    } catch (error) {
        logger.error({error}, `Error removing model: ${modelName}`);
        throw new Error(`Failed to remove model '${modelName}'`);
    }
}
