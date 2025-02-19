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

// Root route
fastify.get("/", async () => {
    fastify.log.info("Root route accessed");
    return {message: "Interview Bot API is running!"};
});

// Register routes
fastify.register(modelRoutes, {prefix: `${API_PREFIX}/management/models`});  // Model Management
fastify.register(benchmarkRoutes, {prefix: `${API_PREFIX}/benchmark`});
fastify.register(answerRoutes, {prefix: `${API_PREFIX}/answers`});
fastify.register(questionRoutes, {prefix: `${API_PREFIX}/questions`});

// Log routes on startup
fastify.ready(() => {
    fastify.log.info(fastify.printRoutes());
});

const start = async () => {
    try {
        await fastify.listen({port: 3000});

        fastify.log.info("Server running at http://localhost:3000");
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
