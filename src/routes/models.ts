import {FastifyInstance} from "fastify";
import {installModel, listAvailableModels, listInstalledModels, removeModel} from "../services/modelService.js";
import {logger} from "../utils/logger.js";

export async function modelRoutes(fastify: FastifyInstance) {
    // List installed models
    fastify.get("/installed", async (_request, reply) => {
        try {
            const result = await listInstalledModels();
            return reply.send(result);
        } catch (error) {
            logger.error({error}, "Error listing installed models");
            return reply.status(500).send({error: "Failed to list installed models"});
        }
    });

    // List available models
    fastify.get("/available", async (request, reply) => {
        try {
            const {all_versions} = request.query as { all_versions?: boolean };
            const result = await listAvailableModels(all_versions ?? false);
            return reply.send(result);
        } catch (error) {
            logger.error({error}, "Error listing available models");
            return reply.status(500).send({error: "Failed to list available models"});
        }
    });

    // Install a model
    fastify.post("/", async (request, reply) => {   // `POST /management/models`
        try {
            const {model_name} = request.body as { model_name: string };

            if (!model_name.trim()) {
                return reply.status(400).send({error: "Model name is required and must be a non-empty string"});
            }

            const result = await installModel(model_name);
            return reply.send(result);
        } catch (error) {
            logger.error({error}, "Error installing model");
            return reply.status(500).send({error: "Failed to install model"});
        }
    });

    // Remove a model
    fastify.delete("/:model_name", async (request, reply) => {  // `DELETE /management/models/{model_name}`
        try {
            const {model_name} = request.params as { model_name: string };

            if (!model_name.trim()) {
                return reply.status(400).send({error: "Model name is required and must be a non-empty string"});
            }

            const result = await removeModel(model_name);
            return reply.send(result);
        } catch (error) {
            logger.error({error}, "Error removing model");
            return reply.status(500).send({error: "Failed to remove model"});
        }
    });
}
