import Fastify from "fastify";
import {questionRoutes} from "./routes/questions.js";
import {answerRoutes} from "./routes/answers.js";
import {benchmarkRoutes} from "./routes/benchmark.js";
import {API_PREFIX} from "./config/constants.js";
import {logger} from "./utils/logger.js";
import {modelRoutes} from "./routes/models.js";

export const fastify = Fastify({
    logger: {
        level: logger.level,
        transport: {
            target: "pino-pretty",
            options: {colorize: true},
        },
    }
});

// **Global Error Handler**
fastify.setErrorHandler((error, request, reply) => {
    logger.error({
        message: error.message || "Unknown error",
        stack: error.stack || "No stack trace",
        route: request.routeOptions.url,
        method: request.method,
        body: request.body,
        query: request.query,
        params: request.params
    }, "Unhandled error in Fastify route");

    reply.status(error.statusCode || 500).send({error: "Internal Server Error"});
});

// **Root route**
fastify.get("/", async () => {
    fastify.log.info("Root route accessed");
    return {message: "Interview Bot API is running!"};
});

// **Register routes**
fastify.register(modelRoutes, {prefix: `${API_PREFIX}/management/models`});
fastify.register(benchmarkRoutes, {prefix: `${API_PREFIX}/benchmark`});
fastify.register(answerRoutes, {prefix: `${API_PREFIX}/answers`});
fastify.register(questionRoutes, {prefix: `${API_PREFIX}/questions`});

// **Log all routes on startup**
fastify.ready(() => {
    fastify.log.info(fastify.printRoutes());
});

// **Start server**
const start = async () => {
    try {
        await fastify.listen({port: 3000});

        fastify.log.info("Server running at http://localhost:3000");
    } catch (err) {
        if (err instanceof Error) {
            logger.error({message: err.message, stack: err.stack}, "Failed to start server");
        } else {
            logger.error({message: "Unknown error", details: err}, "Failed to start server");
        }
        process.exit(1);
    }
};
start();
