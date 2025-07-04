import { z } from "zod";
import { prisma } from "../server.js";
import { LicenseService } from "../services/licenseService.js";
import { LoggingService } from "../services/loggingService.js";

const createLicenseSchema = z.object({
  clientId: z.string(),
  features: z.array(z.string()).default(["basic"]),
  expiresAt: z.string().datetime().optional(),
  domain: z.string().optional(),
});

const validateLicenseSchema = z.object({
  domain: z.string().optional(),
});

export async function licenseRoutes(fastify, options) {
  // POST /licenses - Créer une nouvelle licence
  fastify.post("/", async (request, reply) => {
    try {
      const data = createLicenseSchema.parse(request.body);

      const client = await prisma.client.findUnique({
        where: { id: data.clientId },
      });

      if (!client) {
        return reply.code(404).send({ error: "Client non trouvé" });
      }

      const license = await LicenseService.createLicense(data);

      return reply.code(201).send({
        success: true,
        license: {
          id: license.id,
          key: license.key,
          status: license.status,
          features: license.features,
          expiresAt: license.expiresAt,
          tokenJWT: license.tokenJWT,
        },
      });
    } catch (error) {
      console.error("Erreur création licence:", error);
      return reply.code(400).send({
        error: "Données invalides",
        details: error.message,
      });
    }
  });

  // POST /licenses/validate - Valider une licence
  fastify.post("/validate", async (request, reply) => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return reply.code(401).send({ error: "Token de licence requis" });
      }

      const licenseKey = authHeader.substring(7);
      const body = validateLicenseSchema.parse(request.body);
      const clientIP = request.ip;
      const userAgent = request.headers["user-agent"];

      const validation = await LicenseService.validateLicense(
        licenseKey,
        body.domain,
        clientIP,
        userAgent
      );

      // Log de l'utilisation
      await LoggingService.logUsage(
        validation.license?.id,
        clientIP,
        validation.valid ? "SUCCESS" : validation.reason,
        userAgent
      );

      if (!validation.valid) {
        return reply.code(403).send({
          valid: false,
          error: validation.reason,
        });
      }

      return reply.send({
        valid: true,
        license: {
          id: validation.license.id,
          features: validation.license.features,
          status: validation.license.status,
          expiresAt: validation.license.expiresAt,
          tokenJWT: validation.license.tokenJWT,
          client: {
            name: validation.license.client.name,
            domain: validation.license.client.domain,
          },
        },
      });
    } catch (error) {
      console.error("Erreur validation licence:", error);
      return reply.code(500).send({ error: "Erreur serveur" });
    }
  });

  // GET /licenses/verify - Vérifier une licence par domaine
  fastify.get("/verify", async (request, reply) => {
    try {
      const { domain } = request.query;

      if (!domain) {
        return reply.code(400).send({ error: "Domaine requis" });
      }

      // Chercher un client avec ce domaine qui a une licence active
      const client = await prisma.client.findFirst({
        where: { domain },
        include: {
          licenses: {
            where: {
              status: "ACTIVE",
              expiresAt: {
                gt: new Date(),
              },
            },
            orderBy: { createdAt: "desc" },
          },
        },
      });

      if (!client || client.licenses.length === 0) {
        return reply.code(404).send({ error: "Licence non trouvée" });
      }

      const license = client.licenses[0]; // Prendre la plus récente

      return reply.send({
        valid: true,
        license: {
          id: license.id,
          features: license.features,
          status: license.status,
          expiresAt: license.expiresAt,
          client: {
            name: client.name,
            domain: client.domain,
          },
        },
      });
    } catch (error) {
      console.error("Erreur vérification licence:", error);
      return reply.code(500).send({ error: "Erreur serveur" });
    }
  });

  // POST /licenses/revoke - Révoquer une licence
  fastify.post("/revoke", async (request, reply) => {
    try {
      const { licenseKey } = request.body;

      if (!licenseKey) {
        return reply.code(400).send({ error: "Clé de licence requise" });
      }

      const revoked = await LicenseService.revokeLicense(licenseKey);

      if (!revoked) {
        return reply.code(404).send({ error: "Licence non trouvée" });
      }

      return reply.send({
        success: true,
        message: "Licence révoquée avec succès",
      });
    } catch (error) {
      console.error("Erreur révocation licence:", error);
      return reply.code(500).send({ error: "Erreur serveur" });
    }
  });

  // POST /licenses/ping - Ping d'usage
  fastify.post("/ping", async (request, reply) => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return reply.code(401).send({ error: "Token de licence requis" });
      }

      const licenseKey = authHeader.substring(7);
      const clientIP = request.ip;
      const userAgent = request.headers["user-agent"];

      const license = await prisma.license.findUnique({
        where: { key: licenseKey },
      });

      if (!license) {
        return reply.code(404).send({ error: "Licence non trouvée" });
      }

      // Log du ping
      await LoggingService.logUsage(license.id, clientIP, "PING", userAgent);

      return reply.send({
        success: true,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Erreur ping licence:", error);
      return reply.code(500).send({ error: "Erreur serveur" });
    }
  });

  // GET /licenses/:id - Détails d'une licence
  fastify.get("/:id", async (request, reply) => {
    try {
      const { id } = request.params;

      const license = await prisma.license.findUnique({
        where: { id },
        include: {
          client: true,
          usageLogs: {
            orderBy: { timestamp: "desc" },
            take: 50,
          },
        },
      });

      if (!license) {
        return reply.code(404).send({ error: "Licence non trouvée" });
      }

      return reply.send({
        license: {
          id: license.id,
          key: license.key,
          status: license.status,
          features: license.features,
          expiresAt: license.expiresAt,
          createdAt: license.createdAt,
          updatedAt: license.updatedAt,
          client: {
            id: license.client.id,
            name: license.client.name,
            email: license.client.email,
            domain: license.client.domain,
          },
          usageLogs: license.usageLogs,
        },
      });
    } catch (error) {
      console.error("Erreur récupération licence:", error);
      return reply.code(500).send({ error: "Erreur serveur" });
    }
  });

  // GET /licenses - Liste toutes les licences (admin)
  fastify.get("/", async (request, reply) => {
    try {
      const { page = 1, limit = 10, status } = request.query;

      const where = {};
      if (status) {
        where.status = status;
      }

      const licenses = await prisma.license.findMany({
        where,
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
              domain: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: parseInt(limit),
      });

      const total = await prisma.license.count({ where });

      return reply.send({
        licenses: licenses.map((license) => ({
          id: license.id,
          key: license.key,
          status: license.status,
          features: license.features,
          expiresAt: license.expiresAt,
          createdAt: license.createdAt,
          client: license.client,
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Erreur liste licences:", error);
      return reply.code(500).send({ error: "Erreur serveur" });
    }
  });

  // PUT /licenses/:id - Mettre à jour une licence
  fastify.put("/:id", async (request, reply) => {
    try {
      const { id } = request.params;
      const { status, features, expiresAt } = request.body;

      // Vérifier si la licence existe
      const existingLicense = await prisma.license.findUnique({
        where: { id },
        include: { client: true },
      });

      if (!existingLicense) {
        return reply.code(404).send({ error: "Licence non trouvée" });
      }

      // Préparer les données de mise à jour
      const updateData = {};

      if (status !== undefined) {
        const validStatuses = ["ACTIVE", "SUSPENDED", "REVOKED", "EXPIRED"];
        if (!validStatuses.includes(status)) {
          return reply.code(400).send({ error: "Statut invalide" });
        }
        updateData.status = status;
      }

      if (features !== undefined) {
        if (!Array.isArray(features) || features.length === 0) {
          return reply
            .code(400)
            .send({
              error: "Les fonctionnalités doivent être un tableau non vide",
            });
        }
        updateData.features = features;
      }

      if (expiresAt !== undefined) {
        updateData.expiresAt = expiresAt ? new Date(expiresAt) : null;
      }

      // Si aucune donnée à mettre à jour
      if (Object.keys(updateData).length === 0) {
        return reply.code(400).send({ error: "Aucune donnée à mettre à jour" });
      }

      // Mettre à jour la licence
      const updatedLicense = await prisma.license.update({
        where: { id },
        data: {
          ...updateData,
          updatedAt: new Date(),
        },
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return reply.send({
        success: true,
        message: "Licence mise à jour avec succès",
        license: {
          id: updatedLicense.id,
          key: updatedLicense.key.substring(0, 20) + "...", // Masquer une partie de la clé
          status: updatedLicense.status,
          features: updatedLicense.features,
          expiresAt: updatedLicense.expiresAt,
          client: updatedLicense.client,
          updatedAt: updatedLicense.updatedAt,
        },
      });
    } catch (error) {
      console.error("Erreur mise à jour licence:", error);
      return reply.code(500).send({ error: "Erreur serveur" });
    }
  });

  // DELETE /licenses/:id - Supprimer une licence
  fastify.delete("/:id", async (request, reply) => {
    try {
      const { id } = request.params;

      // Vérifier si la licence existe
      const existingLicense = await prisma.license.findUnique({
        where: { id },
        include: { client: true },
      });

      if (!existingLicense) {
        return reply.code(404).send({ error: "Licence non trouvée" });
      }

      // Supprimer la licence (les logs d'utilisation seront supprimés automatiquement grâce à onDelete: Cascade)
      await prisma.license.delete({
        where: { id },
      });

      return reply.send({
        success: true,
        message: "Licence supprimée avec succès",
      });
    } catch (error) {
      console.error("Erreur suppression licence:", error);
      return reply.code(500).send({ error: "Erreur serveur" });
    }
  });
}
