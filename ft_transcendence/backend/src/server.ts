import Fastify from "fastify";
import dotenv from "dotenv";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";

dotenv.config();

async function buildServer() {
  const app = Fastify({ logger: true });

  await app.register(cors, { origin: true });
  await app.register(jwt, { secret: process.env.JWT_SECRET || "changeme" });

  app.decorate("authenticate", async function (request: any, reply: any) {
    try {
      await request.jwtVerify();
    } catch {
      reply.code(401).send({ error: "Unauthorized" });
    }
  });

  app.register(async (fastify) => {
    fastify.register(authRoutes, { prefix: "/api" });
    fastify.register(usersRoutes, { prefix: "/api" });
  });

  app.get("/api/health", async () => ({ status: "ok" }));

  return app;
}

const start = async () => {
  const app = await buildServer();
  try {
    const port = Number(process.env.PORT) || 3000;
    await app.listen({ port, host: "0.0.0.0" });
    app.log.info(`Server listening on ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
