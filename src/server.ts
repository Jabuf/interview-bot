import Fastify from "fastify";
import {modelRoutes} from "./routes/models.js";

export const fastify = Fastify({
    logger: {
        transport: {
            target: "pino-pretty",
            options: {colorize: true}
        }
    }
});

fastify.get("/", async () => {
    fastify.log.info("Root route accessed");
    return {message: "Interview Bot API is running!"};
});

fastify.register(modelRoutes);

fastify.ready(() => {
    fastify.log.info(fastify.printRoutes())
})


const start = async () => {
    try {
        await fastify.listen({port: 3000});
        console.log("Server running on http://localhost:3000");
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
