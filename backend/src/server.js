import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { PrismaClient } from "@prisma/client";
import { config } from "./config/index.js";
import { licenseRoutes } from "./routes/licenses.js";
import { clientRoutes } from "./routes/clients.js";
import { authRoutes } from "./routes/auth.js";
import { startCronJobs } from "./services/cron.js";

const fastify = Fastify({
  logger: true,
});

// Base de données
export const prisma = new PrismaClient();

// Plugins
await fastify.register(cors, {
  origin: true,
  credentials: true,
});

await fastify.register(jwt, {
  secret: config.JWT_SECRET,
});

// Routes
await fastify.register(authRoutes, { prefix: "/api/auth" });
await fastify.register(licenseRoutes, { prefix: "/api/licenses" });
await fastify.register(clientRoutes, { prefix: "/api/clients" });

// Route de santé
fastify.get("/health", async (request, reply) => {
  return { status: "ok", timestamp: new Date().toISOString() };
});

// Démarrage du serveur
const start = async () => {
  try {
    await fastify.listen({ port: config.PORT, host: "0.0.0.0" });
    console.log(`🚀 Serveur démarré sur le port ${config.PORT}`);

    // Démarrage des tâches cron
    startCronJobs();
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
