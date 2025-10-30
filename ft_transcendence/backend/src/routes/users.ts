import { FastifyInstance, FastifyPluginOptions } from "fastify";
import db from "../db.js";

async function usersRoutes(fastify: FastifyInstance, _opts: FastifyPluginOptions) {
  // Pre-handler for JWT verification
  fastify.addHook("onRequest", fastify.authenticate);

  fastify.get("/users", async () => {
    const rows = db.prepare("SELECT username, email, createdAt FROM users ORDER BY id DESC").all();
    return rows;
  });
}

export default usersRoutes;
