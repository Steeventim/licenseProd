import bcrypt from "bcrypt";
import { prisma } from "../server.js";

export async function authRoutes(fastify, options) {
  // Login administrateur
  fastify.post("/login", async (request, reply) => {
    const { username, password } = request.body;

    if (!username || !password) {
      reply.code(400);
      return { error: "Nom d'utilisateur et mot de passe requis" };
    }

    try {
      // Rechercher l'utilisateur admin
      const adminUser = await prisma.adminUser.findUnique({
        where: { username: username.trim() },
      });

      if (!adminUser || !adminUser.isActive) {
        reply.code(401);
        return { error: "Identifiants invalides" };
      }

      // Vérifier le mot de passe
      const passwordMatch = await bcrypt.compare(password, adminUser.password);

      if (!passwordMatch) {
        reply.code(401);
        return { error: "Identifiants invalides" };
      }

      // Mettre à jour la date de dernière connexion
      await prisma.adminUser.update({
        where: { id: adminUser.id },
        data: { lastLogin: new Date() },
      });

      // Générer le token JWT
      const token = await reply.jwtSign(
        {
          id: adminUser.id,
          username: adminUser.username,
          role: adminUser.role,
        },
        { expiresIn: "24h" }
      );

      return {
        success: true,
        token,
        user: {
          id: adminUser.id,
          username: adminUser.username,
          email: adminUser.email,
          role: adminUser.role,
          lastLogin: adminUser.lastLogin,
        },
      };
    } catch (error) {
      fastify.log.error("Erreur lors de la connexion:", error);
      reply.code(500);
      return { error: "Erreur interne du serveur" };
    }
  });

  // Vérification du token
  fastify.get(
    "/verify",
    {
      preHandler: async (request, reply) => {
        try {
          await request.jwtVerify();
        } catch (err) {
          reply.code(401);
          return { error: "Token invalide ou expiré" };
        }
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.user;

        const adminUser = await prisma.adminUser.findUnique({
          where: { id },
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            lastLogin: true,
            isActive: true,
          },
        });

        if (!adminUser || !adminUser.isActive) {
          reply.code(401);
          return { error: "Utilisateur non trouvé ou inactif" };
        }

        return {
          success: true,
          user: adminUser,
        };
      } catch (error) {
        fastify.log.error("Erreur lors de la vérification:", error);
        reply.code(500);
        return { error: "Erreur interne du serveur" };
      }
    }
  );

  // Logout (côté client principalement, le token expire automatiquement)
  fastify.post("/logout", async (request, reply) => {
    return { success: true, message: "Déconnexion réussie" };
  });

  // Route pour créer un utilisateur admin (temporaire, pour le setup initial)
  fastify.post("/setup-admin", async (request, reply) => {
    const { username, email, password } = request.body;

    if (!username || !email || !password) {
      reply.code(400);
      return { error: "Tous les champs sont requis" };
    }

    try {
      // Vérifier si un admin existe déjà
      const existingAdmin = await prisma.adminUser.findFirst({
        where: {
          OR: [{ username }, { email }],
        },
      });

      if (existingAdmin) {
        reply.code(409);
        return {
          error:
            "Un administrateur avec ce nom d'utilisateur ou email existe déjà",
        };
      }

      // Hasher le mot de passe
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Créer l'utilisateur admin
      const adminUser = await prisma.adminUser.create({
        data: {
          username,
          email,
          password: hashedPassword,
          role: "ADMIN",
        },
      });

      return {
        success: true,
        message: "Administrateur créé avec succès",
        user: {
          id: adminUser.id,
          username: adminUser.username,
          email: adminUser.email,
          role: adminUser.role,
        },
      };
    } catch (error) {
      fastify.log.error("Erreur lors de la création de l'admin:", error);
      reply.code(500);
      return { error: "Erreur interne du serveur" };
    }
  });
}
