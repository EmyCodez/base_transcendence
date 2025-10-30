import { FastifyInstance, FastifyPluginOptions } from "fastify";
import bcrypt from "bcrypt";
import db from "../db.js";

const registerSchema = {
  body: {
    type: "object",
    required: ["username", "email", "password"],
    properties: {
      username: { type: "string", minLength: 3 },
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 6 },
    },
  },
};

const loginSchema = {
  body: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 6 },
    },
  },
};

async function authRoutes(fastify: FastifyInstance, _opts: FastifyPluginOptions) {
  // Ensure JWT plugin already registered in server.ts
  fastify.post("/register", { schema: registerSchema }, async (request, reply) => {
    const { username, email, password } = request.body as any;
    const hashed = await bcrypt.hash(password, 12);

    try {
      const stmt = db.prepare(
        "INSERT INTO users (username, email, password, createdAt) VALUES (?, ?, ?, datetime('now'))"
      );
      const info = stmt.run(username, email, hashed);
      return { id: info.lastInsertRowid, username, email };
    } catch (e) {
      return reply.status(400).send({ error: "User exists or invalid input" });
    }
  });

  fastify.post("/login", { schema: loginSchema }, async (request, reply) => {
    const { email, password } = request.body as any;
    const row = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as
  | { id: number; username: string; email: string; password: string }
  | undefined;

if (!row) return reply.status(401).send({ error: "Invalid credentials" });

const ok = await bcrypt.compare(password, row.password);
if (!ok) return reply.status(401).send({ error: "Invalid credentials" });

const token = fastify.jwt.sign({ id: row.id, username: row.username });
return { token };

  });
}

export default authRoutes;
