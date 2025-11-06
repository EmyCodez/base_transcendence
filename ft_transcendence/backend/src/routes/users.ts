import { FastifyInstance, FastifyPluginOptions } from "fastify";
import db from "../db.js";

async function usersRoutes(fastify: FastifyInstance, _opts: FastifyPluginOptions) {
  // Pre-handler for JWT verification
  fastify.addHook("onRequest", fastify.authenticate);

  fastify.get('/me', async (request, reply) => {
    try {
      await request.jwtVerify();
      const user = db.prepare('SELECT id, username, email FROM users WHERE id = ?')
                     .get((request.user as any).id);
      if (!user) return reply.status(404).send({ error: 'User not found' });
      return user;
    } catch {
      return reply.status(401).send({ error: 'Unauthorized' });
    }
  });
 
  fastify.get("/users", async () => {
    const rows = db.prepare("SELECT username, email, createdAt FROM users ORDER BY id DESC").all();
    return rows;
  });
}

export default usersRoutes;
