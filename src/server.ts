import Fastify from "fastify";
import {questionRoutes} from "./routes/models/questions.js";
import {answerRoutes} from "./routes/models/answers.js";
import {API_PREFIX} from "./config/constants.js";
import {benchmarkRoutes} from "./routes/models/benchmark.js";

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

fastify.register(benchmarkRoutes, { prefix: `${API_PREFIX}/models/benchmark` });
fastify.register(answerRoutes, {prefix: `${API_PREFIX}/models/answers`});
fastify.register(questionRoutes, {prefix: `${API_PREFIX}/models/questions`});

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
