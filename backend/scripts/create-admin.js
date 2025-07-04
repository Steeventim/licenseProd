import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createInitialAdmin() {
  console.log("🔧 Création de l'utilisateur administrateur initial...");

  const username = "Faubell7";
  const email = "admin@licenses.local";
  const password = "Z04y627$";

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingAdmin = await prisma.adminUser.findUnique({
      where: { username },
    });

    if (existingAdmin) {
      console.log("✅ L'administrateur existe déjà.");
      return;
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
        isActive: true,
      },
    });

    console.log("✅ Administrateur créé avec succès:");
    console.log(`   Nom d'utilisateur: ${adminUser.username}`);
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   ID: ${adminUser.id}`);
    console.log(`   Rôle: ${adminUser.role}`);
  } catch (error) {
    console.error("❌ Erreur lors de la création de l'administrateur:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createInitialAdmin();
