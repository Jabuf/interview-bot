import {FastifyInstance} from "fastify";
import {installModel, listAvailableModels, listInstalledModels, removeModel} from "../services/modelService.js";

export async function modelRoutes(fastify: FastifyInstance) {
    /**
     * @description Lists all installed models.
     * @route GET /management/models/installed
     * @returns {Object[]} An array of installed models.
     */
    fastify.get("/installed", async (_request, reply) => {
        const result = await listInstalledModels();
        return reply.send(result);
    });

    /**
     * @description Lists available models that can be installed.
     * @route GET /management/models/available
     * @param {boolean} [all_versions=false] - If true, includes older versions.
     * @returns {Object[]} An array of available models.
     */
    fastify.get("/available", async (request, reply) => {
        const {all_versions} = request.query as { all_versions?: boolean };
        const result = await listAvailableModels(all_versions ?? false);
        return reply.send(result);
    });

    /**
     * @description Installs a new model.
     * @route POST /management/models
     * @param {string} model_name - The name of the model to install.
     * @returns {Object} Installation result.
     */
    fastify.post("/", async (request, reply) => {
        const {model_name} = request.body as { model_name: string };

        if (!model_name.trim()) {
            return reply.status(400).send({error: "Model name is required and must be a non-empty string"});
        }

        const result = await installModel(model_name);
        return reply.send(result);
    });

    /**
     * @description Removes an installed model.
     * @route DELETE /management/models/{model_name}
     * @param {string} model_name - The name of the model to remove.
     * @returns {Object} Removal result.
     */
    fastify.delete("/:model_name", async (request, reply) => {
        const {model_name} = request.params as { model_name: string };

        if (!model_name.trim()) {
            return reply.status(400).send({error: "Model name is required and must be a non-empty string"});
        }

        const result = await removeModel(model_name);
        return reply.send(result);
    });
}
