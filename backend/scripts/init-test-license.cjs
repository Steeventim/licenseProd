const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

// Fonctionnalités stratégiques pour la licence de test
const TEST_FEATURES = [
  'search',          // Moteur de recherche - fonctionnalité de base
  'export',          // Export de données - utile pour les tests
  'analytics',       // Analytics basiques - pour voir les statistiques
  'api_access'       // Accès API - pour les intégrations
];

// Durée de la licence de test : 24 heures
const TEST_LICENSE_DURATION_HOURS = 24;

async function generateTestLicense() {
  try {
    console.log('🚀 Initialisation de la licence de test...');
    
    // 1. Vérifier si un client de test existe déjà
    let testClient = await prisma.client.findFirst({
      where: { domain: 'localhost' }
    });

    if (!testClient) {
      console.log('📝 Création du client de test...');
      testClient = await prisma.client.create({
        data: {
          name: 'Client de Test - Développement',
          email: 'test@localhost.dev',
          domain: 'localhost',
          isActive: true
        }
      });
      console.log(`✅ Client de test créé : ${testClient.name} (ID: ${testClient.id})`);
    } else {
      console.log(`✅ Client de test existant trouvé : ${testClient.name} (ID: ${testClient.id})`);
    }

    // 2. Supprimer les anciennes licences de test expirées
    const deletedLicenses = await prisma.license.deleteMany({
      where: {
        clientId: testClient.id,
        expiresAt: {
          lt: new Date()
        }
      }
    });
    
    if (deletedLicenses.count > 0) {
      console.log(`🗑️  Suppression de ${deletedLicenses.count} licence(s) de test expirée(s)`);
    }

  // 3. Vérifier s'il existe déjà une licence active
  const existingActiveLicense = await prisma.license.findFirst({
    where: {
      clientId: testClient.id,
      status: 'ACTIVE',
      expiresAt: {
        gt: new Date()
      }
    }
  });

    if (existingActiveLicense) {
      console.log(`✅ Licence de test active existante : ${existingActiveLicense.key}`);
      console.log(`📅 Expire le : ${existingActiveLicense.expiresAt.toLocaleString()}`);
      console.log(`🎯 Fonctionnalités : ${existingActiveLicense.features.join(', ')}`);
      return existingActiveLicense;
    }

    // 4. Générer une nouvelle licence de test
    console.log('🔄 Génération d\'une nouvelle licence de test...');
    
    const licenseId = crypto.randomBytes(16).toString('hex').toUpperCase();
    const licenseKey = `LIC-TEST${Date.now().toString(36).toUpperCase()}-${licenseId.substring(0, 32)}`;
    
    const now = new Date();
    const expiresAt = new Date(now.getTime() + (TEST_LICENSE_DURATION_HOURS * 60 * 60 * 1000));

    const testLicense = await prisma.license.create({
      data: {
        key: licenseKey,
        clientId: testClient.id,
        features: TEST_FEATURES,
        status: 'ACTIVE',
        expiresAt,
        createdAt: now
      }
    });

    console.log('\n🎉 Licence de test créée avec succès !');
    console.log('📋 Détails de la licence :');
    console.log(`   🔑 Clé : ${testLicense.key}`);
    console.log(`   👤 Client : ${testClient.name}`);
    console.log(`   🌐 Domaine : ${testClient.domain}`);
    console.log(`   📅 Créée le : ${testLicense.createdAt.toLocaleString()}`);
    console.log(`   ⏰ Expire le : ${testLicense.expiresAt.toLocaleString()}`);
    console.log(`   🎯 Fonctionnalités :`);
    
    TEST_FEATURES.forEach(feature => {
      const descriptions = {
        'search': '🔍 Moteur de recherche avancé',
        'export': '📤 Export de données (CSV, JSON)',
        'analytics': '📊 Analytics et statistiques',
        'api_access': '🔌 Accès complet à l\'API'
      };
      console.log(`      - ${descriptions[feature] || feature}`);
    });
    
    console.log('\n💡 Pour utiliser cette licence dans le frontend :');
    console.log(`   Clé à copier : ${testLicense.key}`);
    console.log(`   Ou cliquer sur "Utiliser la licence de test" dans l'interface\n`);

    return testLicense;

  } catch (error) {
    console.error('❌ Erreur lors de la génération de la licence de test :', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Fonction pour afficher le statut des licences de test
async function showTestLicenseStatus() {
  try {
    const testClient = await prisma.client.findFirst({
      where: { domain: 'localhost' },
      include: {
        licenses: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!testClient) {
      console.log('❌ Aucun client de test trouvé');
      return;
    }

    console.log(`\n📊 Statut des licences pour ${testClient.name} :`);
    
    if (testClient.licenses.length === 0) {
      console.log('   Aucune licence trouvée');
      return;
    }

    testClient.licenses.forEach((license, index) => {
      const hasExpiration = license.expiresAt !== null;
      const isActive = license.status === 'ACTIVE' && (hasExpiration ? license.expiresAt > new Date() : true);
      const status = isActive ? '✅ ACTIVE' : '❌ EXPIRÉE';
      const timeLeft = isActive && hasExpiration ? 
        Math.ceil((license.expiresAt - new Date()) / (1000 * 60 * 60)) + 'h restantes' :
        hasExpiration ? 'Expirée' : 'Permanente';
      
      const expirationDisplay = hasExpiration ? license.expiresAt.toLocaleString() : 'Aucune';
      
      console.log(`   ${index + 1}. ${status} - ${license.key}`);
      console.log(`      📅 ${license.createdAt.toLocaleString()} -> ${expirationDisplay}`);
      console.log(`      ⏰ ${timeLeft}`);
      console.log(`      🎯 ${license.features.join(', ')}`);
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'affichage du statut :', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Gestion des arguments de ligne de commande
const command = process.argv[2];

if (command === 'status') {
  showTestLicenseStatus();
} else if (command === 'generate' || !command) {
  generateTestLicense();
} else {
  console.log('Usage:');
  console.log('  node init-test-license.js          # Génère une nouvelle licence de test');
  console.log('  node init-test-license.js generate # Génère une nouvelle licence de test');
  console.log('  node init-test-license.js status   # Affiche le statut des licences');
}
